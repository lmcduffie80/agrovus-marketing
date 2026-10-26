import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockVerify = vi.fn();
const mockForward = vi.fn();

vi.mock('resend', () => ({
  Resend: class MockResend {
    webhooks = { verify: mockVerify };
    emails = { receiving: { forward: mockForward } };
  },
}));

function makeWebhookRequest(event: object, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/webhooks/resend', {
    method: 'POST',
    headers: {
      'svix-id': 'msg_test',
      'svix-timestamp': '1700000000',
      'svix-signature': 'v1,sig_test',
      ...headers,
    },
    body: JSON.stringify(event),
  });
}

function receivedEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: 'email.received',
    created_at: '2026-10-25T00:00:00.000Z',
    data: {
      email_id: 'em_123',
      created_at: '2026-10-25T00:00:00.000Z',
      from: 'Farmer Joe <joe@example.com>',
      to: ['info@agrovus.com'],
      cc: [],
      bcc: [],
      received_for: ['info@agrovus.com'],
      message_id: '<abc@example.com>',
      subject: 'Pricing question',
      attachments: [],
      ...overrides,
    },
  };
}

async function loadRoute() {
  vi.resetModules();
  return import('@/app/api/webhooks/resend/route');
}

describe('POST /api/webhooks/resend — inbound forwarding', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('RESEND_WEBHOOK_SECRET', 'whsec_test');
    mockForward.mockResolvedValue({ data: { id: 'fwd_1' }, error: null });
  });

  it('forwards mail for info@agrovus.com to lee@innovative-cc.com', async () => {
    const event = receivedEvent();
    mockVerify.mockReturnValue(event);
    const { POST } = await loadRoute();
    const res = await POST(makeWebhookRequest(event));
    expect(res.status).toBe(200);
    expect(mockForward).toHaveBeenCalledOnce();
    const [options, requestOptions] = mockForward.mock.calls[0];
    expect(options).toEqual({
      emailId: 'em_123',
      to: ['lee@innovative-cc.com'],
      from: 'info@agrovus.com',
    });
    expect(requestOptions.idempotencyKey).toBe('forward-em_123-info@agrovus.com');
  });

  it('matches display-name and mixed-case recipients', async () => {
    const event = receivedEvent({ to: ['Agrovus <INFO@Agrovus.com>'], received_for: [] });
    mockVerify.mockReturnValue(event);
    const { POST } = await loadRoute();
    await POST(makeWebhookRequest(event));
    expect(mockForward).toHaveBeenCalledOnce();
  });

  it('forwards when info@ was only BCCd (received_for)', async () => {
    const event = receivedEvent({ to: ['someone@else.com'], received_for: ['info@agrovus.com'] });
    mockVerify.mockReturnValue(event);
    const { POST } = await loadRoute();
    await POST(makeWebhookRequest(event));
    expect(mockForward).toHaveBeenCalledOnce();
  });

  it.each(['sales@agrovus.com', 'support@agrovus.com', 'privacy@agrovus.com', 'lee.mcduffie@agrovus.com'])(
    'forwards mail for %s to lee@innovative-cc.com',
    async (address) => {
      const event = receivedEvent({ to: [address], received_for: [address] });
      mockVerify.mockReturnValue(event);
      const { POST } = await loadRoute();
      await POST(makeWebhookRequest(event));
      expect(mockForward).toHaveBeenCalledOnce();
      expect(mockForward.mock.calls[0][0]).toMatchObject({ to: ['lee@innovative-cc.com'], from: address });
    },
  );

  it('does not forward mail for other agrovus.com addresses', async () => {
    const event = receivedEvent({ to: ['random@agrovus.com'], received_for: ['random@agrovus.com'] });
    mockVerify.mockReturnValue(event);
    const { POST } = await loadRoute();
    const res = await POST(makeWebhookRequest(event));
    expect(res.status).toBe(200);
    expect(mockForward).not.toHaveBeenCalled();
  });

  it('ignores non-inbound event types', async () => {
    const event = { type: 'email.delivered', created_at: '', data: {} };
    mockVerify.mockReturnValue(event);
    const { POST } = await loadRoute();
    const res = await POST(makeWebhookRequest(event));
    expect(res.status).toBe(200);
    expect(mockForward).not.toHaveBeenCalled();
  });

  it('returns 400 when signature headers are missing', async () => {
    const { POST } = await loadRoute();
    const req = new NextRequest('http://localhost/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(receivedEvent()),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockVerify).not.toHaveBeenCalled();
  });

  it('returns 400 when signature verification fails', async () => {
    mockVerify.mockImplementation(() => {
      throw new Error('bad signature');
    });
    const { POST } = await loadRoute();
    const res = await POST(makeWebhookRequest(receivedEvent()));
    expect(res.status).toBe(400);
    expect(mockForward).not.toHaveBeenCalled();
  });

  it('returns 500 so Resend retries when forwarding fails', async () => {
    const event = receivedEvent();
    mockVerify.mockReturnValue(event);
    mockForward.mockResolvedValue({ data: null, error: { message: 'boom', name: 'application_error' } });
    const { POST } = await loadRoute();
    const res = await POST(makeWebhookRequest(event));
    expect(res.status).toBe(500);
  });
});
