# Agrovus Marketing Site — Design Spec
_Date: 2026-05-26_

## Overview

A public-facing Next.js marketing site for Agrovus ERP, separate from the internal ERP app
(`Agrovus-erp`). Provides a landing page, pricing with self-service Stripe checkout, and a
post-checkout welcome page. Deployed to Vercel.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Package manager | pnpm |
| Payments | Stripe (SDK + Checkout Sessions) |
| Database | Neon (existing PostgreSQL — new `accounts` table) |
| Hosting | Vercel |

---

## Pages

### `/` — Landing Page
- Hero: headline, sub-headline, CTA button → `/pricing`
- Features: 4–6 key ERP capabilities (inventory, CRM, production, finance, etc.)
- Social proof: plan tier overview teaser
- Footer: links to /pricing, /privacy

### `/pricing` — Pricing Page
Three tiers, each with monthly license + one-time implementation fee:

| Plan | Monthly | Impl (one-time) |
|------|---------|-----------------|
| Starter | $499/mo | $999 |
| Growth | $1,199/mo | $1,999 |
| Scale | $2,499/mo | $4,999 |

- Each card has a "Get Started" button
- Clicking creates a Stripe Checkout session (impl fee charged immediately; 14-day trial on license)
- Env vars supply the Stripe Price IDs (no hardcoded IDs in code)

### `/welcome` — Post-Checkout Success Page
- Shown after Stripe redirects back on successful checkout
- "You're in — check your email to get started"
- CTA back to agrovus.app (the ERP app)

---

## API Routes

### `POST /api/checkout`
- Input: `{ plan: "starter" | "growth" | "scale" }` (JSON body)
- Creates a Stripe Checkout Session with:
  - `mode: "subscription"`
  - `line_items`: both the impl price (one-time) and license price (recurring)
  - `subscription_data.trial_period_days: 14` — license billing starts after trial
  - Stripe charges the impl fee immediately at checkout; license billing waits for trial end
  - `success_url`: `/welcome?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: `/pricing`
- Returns `{ url: string }` — client redirects to Stripe-hosted checkout

### `POST /api/webhooks/stripe`
- Verifies Stripe signature with `STRIPE_WEBHOOK_SECRET`
- Handles events:
  - `checkout.session.completed` → upsert row in `accounts` table
  - `customer.subscription.updated` → update `plan` / `status`
  - `customer.subscription.deleted` → set `status = cancelled`
  - `invoice.payment_failed` → set `status = past_due`, record `payment_failed_at`
- Raw body required (disable body parser)

---

## Database

New table in the existing Neon instance:

```sql
CREATE TABLE accounts (
  id                      SERIAL PRIMARY KEY,
  email                   TEXT NOT NULL UNIQUE,
  stripe_customer_id      TEXT NOT NULL,
  stripe_subscription_id  TEXT NOT NULL,
  plan                    TEXT NOT NULL,        -- starter | growth | scale
  status                  TEXT NOT NULL,        -- trialing | active | past_due | cancelled
  payment_failed_at       TIMESTAMPTZ,
  cancelled_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);
```

Migration applied manually via Neon console or `psql` before first deploy.

---

## Environment Variables

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_STARTER_LICENSE_PRICE_ID
STRIPE_STARTER_IMPL_PRICE_ID
STRIPE_GROWTH_LICENSE_PRICE_ID
STRIPE_GROWTH_IMPL_PRICE_ID
STRIPE_SCALE_LICENSE_PRICE_ID
STRIPE_SCALE_IMPL_PRICE_ID
NEXT_PUBLIC_APP_URL=https://agrovus.app
DATABASE_URL
```

Set in `.env.local` locally and in Vercel project settings for production.

---

## Middleware

`middleware.ts` — all routes are public on this site. Placeholder gating logic
for a future `/dashboard` route (subscribed customers only).

Public paths: `/`, `/pricing`, `/welcome`, `/api/checkout`, `/api/webhooks`, `/privacy`

---

## Auth

None. The marketing site has no login. Checkout is handled entirely by Stripe-hosted pages.

---

## Out of Scope (v1)

- Blog / case studies
- Customer login / dashboard
- Docs site
- Email sequences (beyond what Stripe sends automatically)
