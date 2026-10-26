import { NextRequest, NextResponse } from "next/server";
import { Resend, type WebhookEventPayload } from "resend";

// Raw body required for Resend (Svix) signature verification — do not parse as JSON
export const dynamic = "force-dynamic";

// Inbound address on agrovus.com → where Resend forwards it. agrovus.com's MX
// points at Resend, so mail to any address not listed here is accepted but only
// kept in the Resend dashboard (Emails → Receiving).
const FORWARDING_RULES: Record<string, string[]> = {
  "info@agrovus.com": ["lee@innovative-cc.com"],
  "sales@agrovus.com": ["lee@innovative-cc.com"],
  "support@agrovus.com": ["lee@innovative-cc.com"],
  "privacy@agrovus.com": ["lee@innovative-cc.com"],
};

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const rawBody = await req.text();

  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return NextResponse.json({ error: "Missing webhook signature headers" }, { status: 400 });
  }

  let event: WebhookEventPayload;
  try {
    event = resend.webhooks.verify({
      payload: rawBody,
      headers: { id, timestamp, signature },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
    });
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ received: true });
  }

  const { email_id, received_for, to, cc } = event.data;
  const recipients = new Set(
    [...(received_for ?? []), ...(to ?? []), ...(cc ?? [])].map(extractAddress),
  );

  for (const [inbound, destinations] of Object.entries(FORWARDING_RULES)) {
    if (!recipients.has(inbound)) continue;

    // Idempotency key keeps Resend webhook retries from delivering duplicates.
    const { error } = await resend.emails.receiving.forward(
      { emailId: email_id, to: destinations, from: inbound },
      { idempotencyKey: `forward-${email_id}-${inbound}` },
    );

    if (error) {
      console.error(`[resend webhook] forward ${inbound} failed:`, error);
      return NextResponse.json({ error: "Forward failed" }, { status: 500 });
    }
    console.log(`[resend webhook] forwarded ${email_id} for ${inbound}`);
  }

  return NextResponse.json({ received: true });
}

function extractAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim().toLowerCase();
}
