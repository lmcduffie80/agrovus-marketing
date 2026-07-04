# Stripe Inline Pricing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ~20 Stripe price-ID environment variables with inline `price_data` in the checkout session, driven entirely by pricing constants in the code.

**Architecture:** `app/api/checkout/route.ts` switches from `{ price: envVarId }` line items to `{ price_data: { ... } }` using hardcoded constants that match the pricing page. `app/api/webhooks/stripe/route.ts` fixes `resolvePlan()` to read `sub.metadata.plan` instead of matching price IDs. `.env.example` drops all `STRIPE_*_PRICE_ID` entries.

**Tech Stack:** Next.js App Router · Stripe SDK v22 · Vitest

**Spec:** `docs/superpowers/specs/2026-07-03-stripe-inline-pricing-design.md`

---

## File Map

| Action | File |
|--------|------|
| Modify | `app/api/checkout/route.ts` |
| Modify | `app/api/webhooks/stripe/route.ts` |
| Modify | `.env.example` |
| Modify | `tests/checkout-route.test.ts` |
| Modify | `tests/webhook-stripe.test.ts` |

---

## Task 1: Update checkout route — rewrite tests then implement

**Files:**
- Modify: `tests/checkout-route.test.ts`
- Modify: `app/api/checkout/route.ts`

- [ ] **Step 1: Rewrite `tests/checkout-route.test.ts` with price_data assertions**

Replace the entire file with:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockSessionCreate = vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/test' });

vi.mock('stripe', () => ({
  default: class MockStripe {
    checkout = { sessions: { create: mockSessionCreate } };
  },
}));

beforeEach(() => {
  mockSessionCreate.mockClear();
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_stub');
  vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://agrovus-marketing.vercel.app');
});

async function post(body: object) {
  vi.resetModules();
  const { POST } = await import('@/app/api/checkout/route');
  return POST(new NextRequest('http://localhost/api/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }));
}

type LineItem = {
  price_data?: {
    product_data?: { name: string };
    unit_amount?: number;
    recurring?: { interval: string };
  };
};

describe('POST /api/checkout', () => {
  it('returns 400 for unknown plan', async () => {
    const res = await post({ planId: 'unknown' });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/unknown plan/i);
  });

  it('returns 400 when planId is missing', async () => {
    const res = await post({});
    expect(res.status).toBe(400);
  });

  it('returns 400 for scale plan (requires sales contact)', async () => {
    const res = await post({ planId: 'scale' });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/sales/i);
  });

  it('returns checkout URL for valid starter plan', async () => {
    const res = await post({ planId: 'starter' });
    expect(res.status).toBe(200);
    expect((await res.json()).url).toBe('https://checkout.stripe.com/test');
  });

  it('returns checkout URL for growth plan with annual billing', async () => {
    const res = await post({ planId: 'growth', billing: 'annual' });
    expect(res.status).toBe(200);
    expect((await res.json()).url).toBeTruthy();
  });

  it('uses price_data with $499 monthly for starter license', async () => {
    await post({ planId: 'starter', billing: 'monthly' });
    const items: LineItem[] = mockSessionCreate.mock.calls[0]?.[0]?.line_items ?? [];
    const license = items.find(li => li.price_data?.product_data?.name === 'Starter License');
    expect(license?.price_data?.unit_amount).toBe(49900);
    expect(license?.price_data?.recurring?.interval).toBe('month');
  });

  it('uses price_data with annual interval and $4,788 for starter annual', async () => {
    await post({ planId: 'starter', billing: 'annual' });
    const items: LineItem[] = mockSessionCreate.mock.calls[0]?.[0]?.line_items ?? [];
    const license = items.find(li => li.price_data?.product_data?.name === 'Starter License');
    expect(license?.price_data?.unit_amount).toBe(399 * 12 * 100);
    expect(license?.price_data?.recurring?.interval).toBe('year');
  });

  it('includes one-time implementation fee without recurring', async () => {
    await post({ planId: 'starter' });
    const items: LineItem[] = mockSessionCreate.mock.calls[0]?.[0]?.line_items ?? [];
    const impl = items.find(li => li.price_data?.product_data?.name === 'Starter Implementation Fee');
    expect(impl?.price_data?.unit_amount).toBe(99900);
    expect(impl?.price_data?.recurring).toBeUndefined();
  });

  it('passes DFII add-on as price_data with $299/mo', async () => {
    const res = await post({ planId: 'starter', addOns: { modules: ['dfii'] } });
    expect(res.status).toBe(200);
    const items: LineItem[] = mockSessionCreate.mock.calls[0]?.[0]?.line_items ?? [];
    const dfii = items.find(li =>
      li.price_data?.product_data?.name === 'Material Requirements Planning (DFII)',
    );
    expect(dfii?.price_data?.unit_amount).toBe(29900);
    expect(dfii?.price_data?.recurring?.interval).toBe('month');
  });

  it('includes subscription trial_period_days: 14', async () => {
    await post({ planId: 'starter' });
    const call = mockSessionCreate.mock.calls[0]?.[0];
    expect(call?.subscription_data?.trial_period_days).toBe(14);
  });

  it('includes plan and add-on metadata in subscription_data', async () => {
    await post({
      planId: 'growth',
      billing: 'annual',
      addOns: { modules: ['dfii'], seatPack: 'seats_5' },
    });
    const meta = mockSessionCreate.mock.calls[0]?.[0]?.subscription_data?.metadata;
    expect(meta?.plan).toBe('growth');
    expect(meta?.billing).toBe('annual');
    expect(meta?.modules).toBe('dfii');
    expect(meta?.seat_pack).toBe('seats_5');
  });
});
```

- [ ] **Step 2: Run tests to confirm the new assertions fail**

```bash
cd /Users/donaldmcduffie/GitHub/Agrovus-marketing
pnpm vitest run tests/checkout-route.test.ts
```

Expected: several tests FAIL — `price_data` assertions fail because the route still uses `price_id`.

- [ ] **Step 3: Rewrite `app/api/checkout/route.ts` with PRICING constants and price_data**

Replace the entire file with:

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// ─── Pricing constants (USD cents, match /pricing page) ───────────────────────

const PLANS = {
  starter: { name: 'Starter', monthly: 49900, annual: 399 * 12 * 100, impl: 99900 },
  growth:  { name: 'Growth',  monthly: 119900, annual: 959 * 12 * 100, impl: 199900 },
  scale:   { name: 'Scale',   monthly: 249900, annual: 1999 * 12 * 100, impl: 499900 },
} as const;

type PlanKey = keyof typeof PLANS;

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
      // 1. Base license (recurring)
      recurringItem(`${plan.name} License`, isAnnual ? plan.annual : plan.monthly, isAnnual ? 'year' : 'month'),
      // 2. One-time implementation fee
      oneTimeItem(`${plan.name} Implementation Fee`, plan.impl),
    ];

    // 3. Module add-ons
    const modules: string[] = addOns.modules || [];
    for (const moduleId of modules) {
      const addon = ADDON_PRICING[moduleId];
      if (addon) lineItems.push(recurringItem(addon.name, addon.unitAmount, 'month'));
    }

    // 4. Seat pack
    if (addOns.seatPack && SEAT_PRICING[addOns.seatPack]) {
      const seat = SEAT_PRICING[addOns.seatPack];
      lineItems.push(recurringItem(seat.name, seat.unitAmount, 'month'));
    }

    // 5. Integrations
    const integrations: string[] = addOns.integrations || [];
    for (const intId of integrations) {
      const integration = INTEGRATION_PRICING[intId];
      if (integration) lineItems.push(recurringItem(integration.name, integration.unitAmount, 'month'));
    }

    // 6. Support tier (if paid)
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
          integrations: integrations.join(','),
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
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
pnpm vitest run tests/checkout-route.test.ts
```

Expected: All 11 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/checkout/route.ts tests/checkout-route.test.ts
git commit -m "feat: replace Stripe price IDs with inline price_data; block Scale plan at API"
```

---

## Task 2: Fix webhook resolvePlan — update tests then fix

**Files:**
- Modify: `tests/webhook-stripe.test.ts`
- Modify: `app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Update `tests/webhook-stripe.test.ts`**

The current test stubs `STRIPE_STARTER_LICENSE_PRICE_ID`, `STRIPE_GROWTH_LICENSE_PRICE_ID`, and `STRIPE_SCALE_LICENSE_PRICE_ID`. Remove those three stubs (they no longer exist in the route). Add one new test verifying that `resolvePlan` uses metadata, not price IDs.

Replace the entire file with:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockConstructEvent = vi.fn();
const mockSubscriptionsRetrieve = vi.fn();
const mockNeonSql = vi.fn().mockResolvedValue([]);

vi.mock('stripe', () => ({
  default: class MockStripe {
    webhooks = { constructEvent: mockConstructEvent };
    subscriptions = { retrieve: mockSubscriptionsRetrieve };
  },
}));

vi.mock('@neondatabase/serverless', () => ({
  neon: () => mockNeonSql,
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeWebhookRequest(event: object) {
  return new NextRequest('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'stripe-signature': 'sig_test' },
    body: JSON.stringify(event),
  });
}

const completedEvent = {
  type: 'checkout.session.completed',
  data: {
    object: {
      mode: 'subscription',
      customer: 'cus_123',
      subscription: 'sub_456',
      customer_details: { email: 'alice@acme.com', name: 'Alice Smith' },
      customer_email: null,
    },
  },
};

const mockSub = {
  id: 'sub_456',
  status: 'trialing',
  items: { data: [{ price: { id: 'price_starter' } }] },
  metadata: {
    plan: 'starter',
    billing: 'monthly',
    modules: 'dfii',
    seat_pack: 'seats_5',
  },
};

describe('POST /api/webhooks/stripe — provision call', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test');
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test');
    vi.stubEnv('PROVISION_SECRET', 'test-provision-secret');
    vi.stubEnv('ERP_PROVISION_URL', 'https://agrovus.app/api/provision');
    vi.stubEnv('DATABASE_URL', 'postgresql://test');

    mockConstructEvent.mockReturnValue(completedEvent);
    mockSubscriptionsRetrieve.mockResolvedValue(mockSub);
    mockNeonSql.mockResolvedValue([]);
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true }) });
  });

  it('calls ERP provision endpoint on checkout.session.completed', async () => {
    vi.resetModules();
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const res = await POST(makeWebhookRequest(completedEvent));
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe('https://agrovus.app/api/provision');
    expect(opts.headers.Authorization).toBe('Bearer test-provision-secret');
    const payload = JSON.parse(opts.body);
    expect(payload.email).toBe('alice@acme.com');
    expect(payload.plan).toBe('starter');
    expect(payload.addOns).toEqual(['dfii']);
    expect(payload.seats).toBe('seats_5');
  });

  it('resolves plan from subscription metadata, not price ID', async () => {
    const growthSub = {
      ...mockSub,
      items: { data: [{ price: { id: 'price_some_unknown_id' } }] },
      metadata: { ...mockSub.metadata, plan: 'growth' },
    };
    mockSubscriptionsRetrieve.mockResolvedValue(growthSub);
    vi.resetModules();
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    await POST(makeWebhookRequest(completedEvent));
    const payload = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(payload.plan).toBe('growth');
  });

  it('still returns 200 if ERP provision call returns non-ok', async () => {
    mockFetch.mockResolvedValue({ ok: false, text: () => Promise.resolve('ERP error') });
    vi.resetModules();
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const res = await POST(makeWebhookRequest(completedEvent));
    expect(res.status).toBe(200);
  });

  it('still returns 200 if ERP provision call throws', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));
    vi.resetModules();
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const res = await POST(makeWebhookRequest(completedEvent));
    expect(res.status).toBe(200);
  });

  it('does not call ERP for non-subscription checkout mode', async () => {
    const nonSubEvent = {
      ...completedEvent,
      data: { object: { ...completedEvent.data.object, mode: 'payment' } },
    };
    mockConstructEvent.mockReturnValue(nonSubEvent);
    vi.resetModules();
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    await POST(makeWebhookRequest(nonSubEvent));
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not call ERP if PROVISION_SECRET is not set', async () => {
    vi.stubEnv('PROVISION_SECRET', '');
    vi.resetModules();
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    await POST(makeWebhookRequest(completedEvent));
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to confirm the new "resolves plan from metadata" test fails**

```bash
pnpm vitest run tests/webhook-stripe.test.ts
```

Expected: the new `'resolves plan from subscription metadata, not price ID'` test FAILS because `resolvePlan` still uses the price ID lookup (which returns `'starter'` due to the `STRIPE_STARTER_LICENSE_PRICE_ID` stub being gone, making the map return `undefined`, falling back to `'starter'` — but the test sends `plan: 'growth'` in metadata so it would fail the assertion).

- [ ] **Step 3: Fix `resolvePlan` in `app/api/webhooks/stripe/route.ts`**

Find the `resolvePlan` function at the bottom of the file (currently lines 134–141):

```typescript
// OLD — delete this:
function resolvePlan(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_STARTER_LICENSE_PRICE_ID!]: "starter",
    [process.env.STRIPE_GROWTH_LICENSE_PRICE_ID!]: "growth",
    [process.env.STRIPE_SCALE_LICENSE_PRICE_ID!]: "scale",
  };
  return map[priceId] ?? "starter";
}
```

Replace with:

```typescript
// NEW — reads from subscription metadata
function resolvePlan(sub: Stripe.Subscription): string {
  return (sub.metadata?.plan ?? 'starter').toLowerCase();
}
```

Then find the call site inside `case "checkout.session.completed"` (currently around line 39):

```typescript
// OLD — delete these two lines:
const priceId = sub.items.data[0]?.price.id ?? "";
const plan = resolvePlan(priceId);
```

Replace with:

```typescript
// NEW — pass the whole sub object
const plan = resolvePlan(sub);
```

Do the same for `case "customer.subscription.updated"` (currently around lines 91–92):

```typescript
// OLD — delete these two lines:
const priceId = sub.items.data[0]?.price.id ?? "";
const plan = resolvePlan(priceId);
```

Replace with:

```typescript
const plan = resolvePlan(sub);
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
pnpm vitest run tests/webhook-stripe.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Run full test suite — no regressions**

```bash
pnpm vitest run
```

Expected: All tests PASS (3 test files, ~28 tests).

- [ ] **Step 6: Commit**

```bash
git add app/api/webhooks/stripe/route.ts tests/webhook-stripe.test.ts
git commit -m "fix: resolve plan from subscription metadata instead of price ID lookup"
```

---

## Task 3: Clean up .env.example

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Remove all `STRIPE_*_PRICE_ID` entries from `.env.example`**

Replace the entire file with:

```bash
# ─── Stripe ───────────────────────────────────────────────────────────────────
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_...           # Use sk_test_... for development
STRIPE_WEBHOOK_SECRET=whsec_...         # Stripe Dashboard → Webhooks → Signing secret

# ─── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://agrovus-marketing.vercel.app

# ─── Database (Neon) ───────────────────────────────────────────────────────────
DATABASE_URL=postgresql://...   # Neon connection string

# ─── ERP Provisioning ──────────────────────────────────────────────────────────
# Shared secret — must match PROVISION_SECRET on the ERP (agrovus.app).
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Never commit the real value.
PROVISION_SECRET=
ERP_PROVISION_URL=https://agrovus.app/api/provision
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: remove Stripe price ID env vars — pricing now defined in code"
```

---

## Final Verification

- [ ] **Run full test suite**

```bash
pnpm vitest run
```

Expected: All tests PASS.

- [ ] **TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: No errors.
