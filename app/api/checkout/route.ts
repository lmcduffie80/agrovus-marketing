// app/api/checkout/route.ts  (v2 — supports add-ons, annual billing, seat packs, integrations, support tiers)

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// ─── Base Plan Price IDs ──────────────────────────────────────────────────────

const BASE_PLANS: Record<string, {
  name: string;
  monthlyLicensePriceId: () => string;
  annualLicensePriceId: () => string;
  implPriceId: () => string;
}> = {
  starter: {
    name: 'Starter',
    monthlyLicensePriceId: () => process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    annualLicensePriceId:  () => process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!,
    implPriceId:           () => process.env.STRIPE_STARTER_IMPL_PRICE_ID!,
  },
  growth: {
    name: 'Growth',
    monthlyLicensePriceId: () => process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID!,
    annualLicensePriceId:  () => process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID!,
    implPriceId:           () => process.env.STRIPE_GROWTH_IMPL_PRICE_ID!,
  },
  scale: {
    name: 'Scale',
    monthlyLicensePriceId: () => process.env.STRIPE_SCALE_MONTHLY_PRICE_ID!,
    annualLicensePriceId:  () => process.env.STRIPE_SCALE_ANNUAL_PRICE_ID!,
    implPriceId:           () => process.env.STRIPE_SCALE_IMPL_PRICE_ID!,
  },
};

const MODULE_PRICES: Record<string, () => string> = {
  dfii:          () => process.env.STRIPE_ADDON_DFII_PRICE_ID!,
  toll:          () => process.env.STRIPE_ADDON_TOLL_PRICE_ID!,
  consolidation: () => process.env.STRIPE_ADDON_CONSOLIDATION_PRICE_ID!,
  api:           () => process.env.STRIPE_ADDON_API_PRICE_ID!,
};

const SEAT_PRICES: Record<string, () => string> = {
  seats_5:   () => process.env.STRIPE_SEATS_5_PRICE_ID!,
  seats_10:  () => process.env.STRIPE_SEATS_10_PRICE_ID!,
  seats_unl: () => process.env.STRIPE_SEATS_UNL_PRICE_ID!,
};

const INTEGRATION_PRICES: Record<string, () => string> = {
  qbo:     () => process.env.STRIPE_INT_QBO_PRICE_ID!,
  api_ext: () => process.env.STRIPE_INT_API_PRICE_ID!,
  edi:     () => process.env.STRIPE_INT_EDI_PRICE_ID!,
};

const SUPPORT_PRICES: Record<string, (() => string) | null> = {
  standard:     null,
  professional: () => process.env.STRIPE_SUPPORT_PRO_PRICE_ID!,
  enterprise:   () => process.env.STRIPE_SUPPORT_ENT_PRICE_ID!,
};

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const {
      planId,
      billing = 'monthly',
      customerEmail,
      addOns = {},
    } = await req.json();

    const plan = BASE_PLANS[planId?.toLowerCase()];
    if (!plan) {
      return NextResponse.json({ error: `Unknown plan: ${planId}` }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agrovus-marketing.vercel.app';
    const isAnnual = billing === 'annual';

    const lineItems: { price: string; quantity: number }[] = [];

    // 1. Base license (recurring)
    lineItems.push({
      price: isAnnual ? plan.annualLicensePriceId() : plan.monthlyLicensePriceId(),
      quantity: 1,
    });

    // 2. One-time implementation fee
    lineItems.push({ price: plan.implPriceId(), quantity: 1 });

    // 3. Module add-ons
    const modules: string[] = addOns.modules || [];
    for (const moduleId of modules) {
      const priceGetter = MODULE_PRICES[moduleId];
      if (priceGetter) lineItems.push({ price: priceGetter(), quantity: 1 });
    }

    // 4. Seat pack
    if (addOns.seatPack && SEAT_PRICES[addOns.seatPack]) {
      lineItems.push({ price: SEAT_PRICES[addOns.seatPack](), quantity: 1 });
    }

    // 5. Integrations
    const integrations: string[] = addOns.integrations || [];
    for (const intId of integrations) {
      const priceGetter = INTEGRATION_PRICES[intId];
      if (priceGetter) lineItems.push({ price: priceGetter(), quantity: 1 });
    }

    // 6. Support tier (if paid)
    const supportGetter = SUPPORT_PRICES[addOns.support || 'standard'];
    if (supportGetter) lineItems.push({ price: supportGetter(), quantity: 1 });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan:         planId,
          agrovus_plan: plan.name,
          billing,
          modules:      modules.join(','),
          seat_pack:    addOns.seatPack || '',
          integrations: integrations.join(','),
          support:      addOns.support || 'standard',
        },
      },
      metadata: { plan: planId, billing },
      success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url:  `${appUrl}/pricing?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    console.error('[Stripe Checkout Error]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
