# Stripe Inline Pricing — Design Spec

**Date:** 2026-07-03
**Status:** Approved

## Problem

The current checkout route (`app/api/checkout/route.ts`) requires ~20 Stripe price IDs to be manually created in the Stripe dashboard and stored as environment variables. This creates friction on every pricing change and is currently broken — the webhook's `resolvePlan()` references `STRIPE_STARTER_LICENSE_PRICE_ID` while the checkout route uses `STRIPE_STARTER_MONTHLY_PRICE_ID` (different names, both undefined in production).

## Solution

Replace all Stripe price ID lookups with inline `price_data` in the checkout session, using a `PRICING` constant defined in the route file that mirrors the pricing page exactly. The webhook's `resolvePlan()` switches from price-ID matching to reading `sub.metadata.plan`, which the checkout route already sets correctly.

## Scope

- **Files changed:** `app/api/checkout/route.ts`, `app/api/webhooks/stripe/route.ts`, `.env.example`
- **Files unchanged:** pricing page UI, webhook DB logic, ERP provision endpoint, welcome page
- **Scale plan:** blocked at the checkout API level (Scale goes through `mailto:sales@agrovus.app`)

---

## Architecture

### `app/api/checkout/route.ts`

Replace the env-var price ID maps with a single typed `PRICING` constant:

```typescript
const PRICING = {
  starter: {
    name: 'Starter',
    monthly: 49900,      // $499/mo
    annual:  399 * 12 * 100, // $4,788/yr
    impl:    99900,      // $999 one-time
  },
  growth: {
    name: 'Growth',
    monthly: 119900,
    annual:  959 * 12 * 100,
    impl:    199900,
  },
  scale: {
    name: 'Scale',
    monthly: 249900,
    annual:  1999 * 12 * 100,
    impl:    499900,
  },
};

const ADDON_PRICING: Record<string, { name: string; unitAmount: number }> = {
  dfii:          { name: 'Material Requirements Planning (DFII)', unitAmount: 29900 },
  toll:          { name: 'Toll Manufacturing',                    unitAmount: 19900 },
  consolidation: { name: 'Advanced Financial Consolidation',      unitAmount: 24900 },
  api:           { name: 'API Access',                            unitAmount: 19900 },
};

const SEAT_PRICING: Record<string, { name: string; unitAmount: number }> = {
  seats_5:   { name: 'Additional 5 Users',        unitAmount:  9900 },
  seats_10:  { name: 'Additional 10 Users',        unitAmount: 17900 },
  seats_unl: { name: 'Unlimited Additional Users', unitAmount: 29900 },
};

const INTEGRATION_PRICING: Record<string, { name: string; unitAmount: number }> = {
  qbo:     { name: 'QuickBooks Online Integration', unitAmount: 14900 },
  api_ext: { name: 'API (100K calls/mo)',            unitAmount:  4900 },
  edi:     { name: 'EDI / Custom Export',            unitAmount: 29900 },
};

const SUPPORT_PRICING: Record<string, { name: string; unitAmount: number } | null> = {
  standard:     null,
  professional: { name: 'Professional Support', unitAmount: 19900 },
  enterprise:   { name: 'Enterprise Support',   unitAmount: 49900 },
};
```

Each line item switches from:
```typescript
{ price: priceId, quantity: 1 }
```
to:
```typescript
{
  price_data: {
    currency: 'usd',
    product_data: { name: 'Starter License' },
    unit_amount: 49900,
    recurring: { interval: 'month' },   // omit for one-time items
  },
  quantity: 1,
}
```

Annual billing uses `interval: 'year'` and `unit_amount = rate * 12` (already computed in PRICING constant).

Add a guard at the top of the handler:
```typescript
if (planId?.toLowerCase() === 'scale') {
  return NextResponse.json({ error: 'Scale plan requires contacting sales' }, { status: 400 });
}
```

### `app/api/webhooks/stripe/route.ts`

Replace `resolvePlan(priceId)` with `resolvePlan(sub)`:

```typescript
function resolvePlan(sub: Stripe.Subscription): string {
  return (sub.metadata?.plan ?? 'starter').toLowerCase();
}
```

Update call site from `resolvePlan(priceId)` to `resolvePlan(sub)` (subscription already retrieved above).

### `.env.example`

Remove all `STRIPE_*_PRICE_ID` entries. Remaining Stripe vars:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Data Flow

```
Customer selects plan + add-ons on /pricing → clicks "Start Free Trial"
  → POST /api/checkout { planId, billing, customerEmail, addOns }

checkout/route.ts:
  - Blocks planId === 'scale' (400)
  - Looks up PRICING constant for base plan rates
  - Builds line_items using price_data (no Stripe price lookup needed)
  - Creates Stripe Checkout Session with subscription_data.metadata: { plan, billing, modules, seat_pack, ... }
  → Returns { url: session.url } → browser redirects to Stripe Checkout

Customer pays → Stripe fires checkout.session.completed
  → webhook verifies signature
  → retrieves subscription
  → resolvePlan(sub) reads sub.metadata.plan
  → INSERT into accounts (Neon, idempotent ON CONFLICT)
  → POST /api/provision on ERP (Bearer token, idempotent)

ERP creates account → sends welcome email → customer logs in → forced password change
```

---

## Pricing Reference

All amounts in USD cents.

### Base Plans

| Plan | Monthly | Annual (per year) | Implementation (one-time) |
|------|---------|-------------------|--------------------------|
| Starter | $499 | $4,788 ($399×12) | $999 |
| Growth | $1,199 | $11,508 ($959×12) | $1,999 |
| Scale | $2,499 | $23,988 ($1,999×12) | $4,999 |

### Add-Ons (monthly, all plans)

| Add-On | Price |
|--------|-------|
| Material Requirements Planning (DFII) | $299/mo |
| Toll Manufacturing | $199/mo |
| Advanced Financial Consolidation | $249/mo |
| API Access | $199/mo |

### Seat Packs (monthly)

| Pack | Price |
|------|-------|
| +5 users | $99/mo |
| +10 users | $179/mo |
| Unlimited users | $299/mo |

### Integrations (monthly)

| Integration | Price |
|-------------|-------|
| QuickBooks Online | $149/mo |
| API (100K calls/mo) | $49/mo |
| EDI / Custom Export | $299/mo |

### Support Tiers (monthly)

| Tier | Price |
|------|-------|
| Standard | Included |
| Professional | $199/mo |
| Enterprise | $499/mo |

---

## Error Handling & Edge Cases

| Scenario | Behavior |
|----------|----------|
| `planId === 'scale'` submitted to API | 400 — Scale requires sales contact |
| Unknown add-on key | Silently skipped (existing behavior) |
| `STRIPE_SECRET_KEY` missing | Stripe throws on initialization — 500 |
| Webhook without `plan` metadata | `resolvePlan` falls back to `'starter'` |
| Stripe retries webhook | `ON CONFLICT` in accounts table is idempotent; ERP returns `{ ok: true, existed: true }` |
| Annual billing for add-ons | Add-ons stay monthly regardless of base plan billing cycle |
