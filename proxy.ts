import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/pricing", "/welcome", "/privacy", "/api/checkout", "/api/webhooks"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Future: gate /dashboard against active subscription
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
