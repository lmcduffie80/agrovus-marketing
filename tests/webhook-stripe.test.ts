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
