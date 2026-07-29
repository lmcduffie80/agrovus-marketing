import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/pricing", "/welcome", "/privacy", "/api/checkout", "/api/webhooks"];

// ─── Pre-launch site lock ──────────────────────────────────────────────────
// Set SITE_LOCK_PASSWORD (locally in .env.local, on Vercel under Project →
// Settings → Environment Variables) to hide the whole site behind a
// "Coming Soon" placeholder. Everyone gets the placeholder except you.
//
// To unlock your own browser, visit any page once with ?key=<password>
// appended, e.g. https://agrovus.com/?key=your-password — this sets a
// long-lived cookie so you don't have to repeat it. Remove the env var (or
// leave it unset) to open the site back up to everyone.
const SITE_LOCK_PASSWORD = process.env.SITE_LOCK_PASSWORD;
const LOCK_BYPASS_COOKIE = "av_access";
// Paths that must stay reachable even while locked: the placeholder itself,
// API routes (Stripe webhooks, provisioning callbacks, etc. aren't "content"
// a visitor browses), and metadata files.
const LOCK_EXEMPT_PATHS = ["/coming-soon", "/api"];

function isLockExempt(pathname: string) {
  return LOCK_EXEMPT_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// The storefront subdomain is a separate product (proxied to the Agrovus-erp
// commerce module via next.config.ts rewrites) with its own tenant-admin auth
// — it launches independently of the marketing site and must never be gated
// behind the marketing site's own pre-launch lock or PUBLIC_PATHS logic.
const STORE_HOSTNAME_PREFIX = "store.";

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const hostname = req.headers.get("host") ?? "";

  if (hostname.startsWith(STORE_HOSTNAME_PREFIX)) {
    return NextResponse.next();
  }

  if (SITE_LOCK_PASSWORD && !isLockExempt(pathname)) {
    const key = searchParams.get("key");

    if (key === SITE_LOCK_PASSWORD) {
      const url = req.nextUrl.clone();
      url.searchParams.delete("key");
      const res = NextResponse.redirect(url);
      res.cookies.set(LOCK_BYPASS_COOKIE, SITE_LOCK_PASSWORD, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      return res;
    }

    const hasAccess = req.cookies.get(LOCK_BYPASS_COOKIE)?.value === SITE_LOCK_PASSWORD;
    if (!hasAccess) {
      const res = NextResponse.rewrite(new URL("/coming-soon", req.url));
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
  }

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Future: gate /dashboard against active subscription
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
