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
