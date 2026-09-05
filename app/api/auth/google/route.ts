import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthUrl, isConfigured } from "@/lib/google-oauth";
import { safeNext } from "@/lib/auth";

export const runtime = "nodejs";

const OAUTH_STATE_COOKIE = "calm_oauth";

/**
 * Starts Google sign-in. The OAuth `state` is a random nonce stored in a
 * short-lived HttpOnly cookie together with the validated post-login path,
 * so the callback can reject forged or replayed responses.
 */
export async function GET(req: Request) {
  if (!isConfigured()) {
    return NextResponse.redirect(new URL("/auth/login?google=unavailable", req.url));
  }

  const url = new URL(req.url);
  const next = safeNext(url.searchParams.get("next"));
  const nonce = randomBytes(16).toString("base64url");
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${url.origin}/api/auth/google/callback`;

  const res = NextResponse.redirect(buildAuthUrl(redirectUri, nonce));
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.headers.append(
    "Set-Cookie",
    `${OAUTH_STATE_COOKIE}=${encodeURIComponent(JSON.stringify({ n: nonce, next }))}; Path=/api/auth/google; HttpOnly; SameSite=Lax; Max-Age=600${secure}`
  );
  return res;
}
