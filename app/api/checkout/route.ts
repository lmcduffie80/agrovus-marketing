import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const PLANS = {
  starter: {
    license: () => process.env.STRIPE_STARTER_LICENSE_PRICE_ID!,
    impl: () => process.env.STRIPE_STARTER_IMPL_PRICE_ID!,
  },
  growth: {
    license: () => process.env.STRIPE_GROWTH_LICENSE_PRICE_ID!,
    impl: () => process.env.STRIPE_GROWTH_IMPL_PRICE_ID!,
  },
  scale: {
    license: () => process.env.STRIPE_SCALE_LICENSE_PRICE_ID!,
    impl: () => process.env.STRIPE_SCALE_IMPL_PRICE_ID!,
  },
} as const;

type PlanKey = keyof typeof PLANS;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const plan = body?.plan as string | undefined;

  if (!plan || !(plan in PLANS)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const prices = PLANS[plan as PlanKey];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      { price: prices.impl(), quantity: 1 },
      { price: prices.license(), quantity: 1 },
    ],
    subscription_data: {
      trial_period_days: 14,
    },
    success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
