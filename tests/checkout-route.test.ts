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
  vi.stubEnv('STRIPE_STARTER_MONTHLY_PRICE_ID', 'price_starter_monthly');
  vi.stubEnv('STRIPE_STARTER_ANNUAL_PRICE_ID', 'price_starter_annual');
  vi.stubEnv('STRIPE_STARTER_IMPL_PRICE_ID', 'price_starter_impl');
  vi.stubEnv('STRIPE_GROWTH_MONTHLY_PRICE_ID', 'price_growth_monthly');
  vi.stubEnv('STRIPE_GROWTH_ANNUAL_PRICE_ID', 'price_growth_annual');
  vi.stubEnv('STRIPE_GROWTH_IMPL_PRICE_ID', 'price_growth_impl');
  vi.stubEnv('STRIPE_SCALE_MONTHLY_PRICE_ID', 'price_scale_monthly');
  vi.stubEnv('STRIPE_SCALE_ANNUAL_PRICE_ID', 'price_scale_annual');
  vi.stubEnv('STRIPE_SCALE_IMPL_PRICE_ID', 'price_scale_impl');
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

  it('passes add-on price IDs to Stripe when modules selected', async () => {
    vi.stubEnv('STRIPE_ADDON_DFII_PRICE_ID', 'price_dfii');
    const res = await post({ planId: 'starter', addOns: { modules: ['dfii'] } });
    expect(res.status).toBe(200);
    const call = mockSessionCreate.mock.calls[0]?.[0];
    const priceIds = call?.line_items?.map((li: { price: string }) => li.price) ?? [];
    expect(priceIds).toContain('price_dfii');
  });

  it('includes subscription trial_period_days: 14', async () => {
    await post({ planId: 'starter' });
    const call = mockSessionCreate.mock.calls[0]?.[0];
    expect(call?.subscription_data?.trial_period_days).toBe(14);
  });
});
