import { NextResponse } from "next/server";
import { buildAuthUrl, isConfigured } from "@/lib/google-oauth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!isConfigured()) {
    return NextResponse.redirect(new URL("/auth/login?google=unavailable", req.url));
  }

  const url = new URL(req.url);
  const next = url.searchParams.get("next") ?? "/dashboard";
  const state = encodeURIComponent(next);

  // Compute the canonical redirect URI for this deployment.
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ?? `${url.origin}/api/auth/google/callback`;

  const authUrl = buildAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
