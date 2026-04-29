import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

const DASHBOARD_SUBDOMAIN = process.env.DASHBOARD_SUBDOMAIN ?? "relax";

// Paths that bypass the relax-subdomain rewrite (they live at the original path).
const REWRITE_PASSTHROUGH = [
  "/api",
  "/_next",
  "/dashboard",
  "/onboarding",
  "/auth",
  "/static",
  "/favicon",
  "/robots",
  "/sitemap",
];

// Paths under /dashboard that don't require auth (none for now, but keep the hook).
const PUBLIC_DASHBOARD_PATHS: string[] = [];

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0];
  const isDashboardHost = hostname.startsWith(`${DASHBOARD_SUBDOMAIN}.`);

  const url = req.nextUrl.clone();
  let pathname = url.pathname;

  // 1) Rewrite for the relax.* subdomain → /dashboard/*
  if (isDashboardHost && !REWRITE_PASSTHROUGH.some((p) => pathname.startsWith(p))) {
    url.pathname = pathname === "/" ? "/dashboard" : `/dashboard${pathname}`;
    pathname = url.pathname;
  }

  // 2) Auth gate for anything under /dashboard.
  if (pathname.startsWith("/dashboard") && !PUBLIC_DASHBOARD_PATHS.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const claims = await verifySession(token);
    if (!claims) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      // Preserve the path the user was trying to reach (relative to the public site).
      const intended = isDashboardHost
        ? req.nextUrl.pathname === "/"
          ? "/dashboard"
          : `/dashboard${req.nextUrl.pathname}`
        : req.nextUrl.pathname;
      loginUrl.searchParams.set("next", intended);
      // Send to the main domain's /auth/login if we're on the dashboard subdomain.
      if (isDashboardHost) {
        const mainHost = hostname.replace(`${DASHBOARD_SUBDOMAIN}.`, "");
        if (mainHost) {
          const port = host.includes(":") ? host.split(":")[1] : "";
          loginUrl.host = port ? `${mainHost}:${port}` : mainHost;
        }
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  // If we set a rewrite earlier, return that.
  if (url.pathname !== req.nextUrl.pathname) {
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
