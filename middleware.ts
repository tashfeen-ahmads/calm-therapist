import { NextRequest, NextResponse } from "next/server";

/**
 * Maps the dashboard subdomain (e.g. relax.calmtherapist.com) onto the
 * /dashboard path of the same Next.js app. So:
 *   relax.example.com/            → /dashboard
 *   relax.example.com/journal     → /dashboard/journal
 *   relax.example.com/api/chat    → /api/chat   (passes through)
 *   relax.example.com/_next/...   → /_next/...  (passes through)
 *
 * Configure via env: DASHBOARD_SUBDOMAIN (defaults to "relax").
 */
const DASHBOARD_SUBDOMAIN = process.env.DASHBOARD_SUBDOMAIN ?? "relax";

const PASSTHROUGH_PREFIXES = ["/api", "/_next", "/onboarding", "/dashboard", "/static", "/favicon", "/robots", "/sitemap"];

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0]; // strip port
  const isDashboardHost = hostname.startsWith(`${DASHBOARD_SUBDOMAIN}.`);

  if (!isDashboardHost) return NextResponse.next();

  const { pathname, search } = req.nextUrl;

  // Already routed (or framework asset) — pass through.
  if (PASSTHROUGH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/dashboard" : `/dashboard${pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
