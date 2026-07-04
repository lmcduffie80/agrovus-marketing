import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

// Raw body required for Stripe signature verification — do not parse as JSON
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const customer = session.customer as string;
        const subscription = session.subscription as string;
        const email = session.customer_details?.email ?? session.customer_email ?? "";

        // Retrieve subscription to determine plan from metadata
        const sub = await stripe.subscriptions.retrieve(subscription);
        const plan = resolvePlan(sub);

        await sql`
          INSERT INTO accounts (email, stripe_customer_id, stripe_subscription_id, plan, status)
          VALUES (${email}, ${customer}, ${subscription}, ${plan}, ${sub.status})
          ON CONFLICT (email) DO UPDATE SET
            stripe_customer_id = EXCLUDED.stripe_customer_id,
            stripe_subscription_id = EXCLUDED.stripe_subscription_id,
            plan = EXCLUDED.plan,
            status = EXCLUDED.status
        `;

        // Call ERP to auto-provision the customer account
        const erpUrl = process.env.ERP_PROVISION_URL ?? 'https://agrovus.app/api/provision';
        const provisionSecret = process.env.PROVISION_SECRET;
        if (provisionSecret) {
          const addOns = sub.metadata.modules
            ? sub.metadata.modules.split(',').filter(Boolean)
            : [];
          try {
            const provisionRes = await fetch(erpUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${provisionSecret}`,
              },
              body: JSON.stringify({
                email,
                name: session.customer_details?.name ?? '',
                company: email.split('@')[1]?.split('.')[0] ?? '',
                plan,
                addOns,
                billing: sub.metadata.billing ?? 'monthly',
                seats: sub.metadata.seat_pack ?? '',
                stripeCustomerId: customer,
                stripeSubscriptionId: subscription,
              }),
            });
            if (!provisionRes.ok) {
              console.error('[stripe webhook] ERP provision failed:', await provisionRes.text());
            } else {
              console.log('[stripe webhook] ERP provisioned:', email);
            }
          } catch (provisionErr) {
            console.error('[stripe webhook] ERP provision error (non-fatal):', provisionErr);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const plan = resolvePlan(sub);

        await sql`
          UPDATE accounts
          SET plan = ${plan}, status = ${sub.status}
          WHERE stripe_subscription_id = ${sub.id}
        `;
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await sql`
          UPDATE accounts
          SET status = 'cancelled', cancelled_at = NOW()
          WHERE stripe_subscription_id = ${sub.id}
        `;
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // In Stripe v22+, subscription ID lives at parent.subscription_details.subscription
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subRef === "string" ? subRef : subRef?.id ?? null;
        if (!subId) break;
        await sql`
          UPDATE accounts
          SET status = 'past_due', payment_failed_at = NOW()
          WHERE stripe_subscription_id = ${subId}
        `;
        break;
      }
    }
  } catch (err) {
    console.error("[stripe webhook] db error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function resolvePlan(sub: Stripe.Subscription): string {
  return (sub.metadata?.plan ?? 'starter').toLowerCase();
}
