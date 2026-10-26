import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSql = vi.fn();
const mockSend = vi.fn();

vi.mock('@neondatabase/serverless', () => ({
  neon: () => mockSql,
}));

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = {
  name: 'Alice Farmer',
  email: 'Alice@Acme.com',
  company: 'Acme Ag',
  phone: '555-0100',
  topic: 'enterprise',
  message: 'We need an ERP for 3 warehouses.',
};

async function submit(fields: Record<string, string>) {
  const { submitContact } = await import('@/app/contact/actions');
  return submitContact({ status: 'idle' }, form(fields));
}

describe('submitContact', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('DATABASE_URL', 'postgresql://test');
    vi.stubEnv('RESEND_API_KEY', 're_test');
    mockSql.mockResolvedValue([]);
    mockSend.mockResolvedValue({ data: { id: 'em_1' }, error: null });
  });

  it('saves the lead and emails info@agrovus.com with reply-to set to the prospect', async () => {
    const state = await submit(valid);
    expect(state.status).toBe('success');
    expect(mockSql).toHaveBeenCalledOnce();
    expect(mockSend).toHaveBeenCalledOnce();
    const email = mockSend.mock.calls[0][0];
    expect(email.to).toEqual(['info@agrovus.com']);
    expect(email.replyTo).toBe('alice@acme.com');
    expect(email.subject).toBe('New Enterprise lead: Alice Farmer (Acme Ag)');
    expect(email.text).toContain('We need an ERP for 3 warehouses.');
  });

  it('returns field errors and keeps the entered values when required fields are missing', async () => {
    const state = await submit({ ...valid, name: '', email: 'not-an-email', message: '  ' });
    expect(state.status).toBe('error');
    expect(Object.keys(state.fieldErrors ?? {}).sort()).toEqual(['email', 'message', 'name']);
    expect(state.values?.company).toBe('Acme Ag');
    expect(mockSql).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('falls back to the general topic for unknown topics', async () => {
    await submit({ ...valid, topic: 'bogus' });
    expect(mockSend.mock.calls[0][0].subject).toMatch(/^New General inquiry lead/);
  });

  it('silently drops submissions that fill the honeypot', async () => {
    const state = await submit({ ...valid, website: 'http://spam.example' });
    expect(state.status).toBe('success');
    expect(mockSql).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('still succeeds when only the database insert fails', async () => {
    mockSql.mockRejectedValue(new Error('db down'));
    const state = await submit(valid);
    expect(state.status).toBe('success');
  });

  it('still succeeds when only the email fails', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const state = await submit(valid);
    expect(state.status).toBe('success');
  });

  it('returns an error when both the database and email fail', async () => {
    mockSql.mockRejectedValue(new Error('db down'));
    mockSend.mockRejectedValue(new Error('network'));
    const state = await submit(valid);
    expect(state.status).toBe('error');
    expect(state.message).toContain('info@agrovus.com');
    expect(state.values?.email).toBe('alice@acme.com');
  });
});
