// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// ─── Pricing constants (USD cents, match /pricing page) ───────────────────────

const PLANS = {
  starter: { name: 'Starter', monthly: 49900, annual: 399 * 12 * 100, impl: 500000 },
  growth:  { name: 'Growth',  monthly: 119900, annual: 959 * 12 * 100, impl: 1200000 },
  scale:   { name: 'Scale',   monthly: 249900, annual: 1999 * 12 * 100, impl: 2000000 },
} as const;

type PlanKey = keyof typeof PLANS;

const ADDON_PRICING: Record<string, { name: string; unitAmount: number }> = {
  dfii:          { name: 'Material Requirements Planning (DFII)', unitAmount: 29900 },
  toll:          { name: 'Formulation Manuals',                   unitAmount: 19900 },
  consolidation: { name: 'Multi-Entity Finance',                  unitAmount: 24900 },
};

const SEAT_PRICING: Record<string, { name: string; unitAmount: number }> = {
  seats_5:   { name: 'Additional 5 Users',        unitAmount:  9900 },
  seats_10:  { name: 'Additional 10 Users',        unitAmount: 17900 },
  seats_unl: { name: 'Unlimited Additional Users', unitAmount: 29900 },
};

const SUPPORT_PRICING: Record<string, { name: string; unitAmount: number } | null> = {
  standard:     null,
  professional: { name: 'Professional Support', unitAmount: 19900 },
  enterprise:   { name: 'Enterprise Support',   unitAmount: 49900 },
};

// ─── Line item helpers ────────────────────────────────────────────────────────

function recurringItem(name: string, unitAmount: number, interval: 'month' | 'year') {
  return {
    price_data: {
      currency: 'usd' as const,
      product_data: { name },
      unit_amount: unitAmount,
      recurring: { interval },
    },
    quantity: 1,
  };
}

function oneTimeItem(name: string, unitAmount: number) {
  return {
    price_data: {
      currency: 'usd' as const,
      product_data: { name },
      unit_amount: unitAmount,
    },
    quantity: 1,
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const {
      planId,
      billing = 'monthly',
      customerEmail,
      addOns = {},
    } = await req.json();

    const key = planId?.toLowerCase() as PlanKey;

    if (key === 'scale') {
      return NextResponse.json({ error: 'Scale plan requires contacting sales' }, { status: 400 });
    }

    const plan = PLANS[key];
    if (!plan) {
      return NextResponse.json({ error: `Unknown plan: ${planId}` }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agrovus-marketing.vercel.app';
    const isAnnual = billing === 'annual';

    const lineItems = [
      recurringItem(`${plan.name} License`, isAnnual ? plan.annual : plan.monthly, isAnnual ? 'year' : 'month'),
      oneTimeItem(`${plan.name} Implementation Fee`, plan.impl),
    ];

    const modules: string[] = addOns.modules || [];
    for (const moduleId of modules) {
      const addon = ADDON_PRICING[moduleId];
      if (addon) lineItems.push(recurringItem(addon.name, addon.unitAmount, 'month'));
    }

    if (addOns.seatPack && SEAT_PRICING[addOns.seatPack]) {
      const seat = SEAT_PRICING[addOns.seatPack];
      lineItems.push(recurringItem(seat.name, seat.unitAmount, 'month'));
    }

    const support = SUPPORT_PRICING[addOns.support || 'standard'];
    if (support) lineItems.push(recurringItem(support.name, support.unitAmount, 'month'));

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan:         key,
          agrovus_plan: plan.name,
          billing,
          modules:      modules.join(','),
          seat_pack:    addOns.seatPack || '',
          support:      addOns.support || 'standard',
        },
      },
      metadata: { plan: key, billing },
      success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}&plan=${key}`,
      cancel_url:  `${appUrl}/pricing?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    console.error('[Stripe Checkout Error]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
