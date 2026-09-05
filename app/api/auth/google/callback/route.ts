import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCode, fetchProfile, isConfigured } from "@/lib/google-oauth";
import { buildSessionCookie, cookieDomainFor, isAdminEmail, safeNext, signSession } from "@/lib/auth";
import { findOrCreateOAuthUser } from "@/lib/users";

export const runtime = "nodejs";

const OAUTH_STATE_COOKIE = "calm_oauth";

function fail(req: Request, reason: string) {
  return NextResponse.redirect(new URL(`/auth/login?google=${reason}`, req.url));
}

export async function GET(req: Request) {
  if (!isConfigured()) return fail(req, "unavailable");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return fail(req, "cancelled");

  // Verify the state nonce against the cookie set when sign-in started.
  let next = "/dashboard";
  try {
    const raw = cookies().get(OAUTH_STATE_COOKIE)?.value;
    if (!raw) return fail(req, "state");
    const parsed = JSON.parse(decodeURIComponent(raw)) as { n?: string; next?: string };
    if (!parsed.n || parsed.n !== state) return fail(req, "state");
    next = safeNext(parsed.next);
  } catch {
    return fail(req, "state");
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${url.origin}/api/auth/google/callback`;

  let email: string;
  let name: string;
  try {
    const tokens = await exchangeCode(code, redirectUri);
    const profile = (await fetchProfile(tokens.access_token)) as {
      email: string;
      name?: string;
      email_verified?: boolean;
      verified_email?: boolean;
    };
    const verified = profile.email_verified ?? profile.verified_email;
    if (verified === false) return fail(req, "unverified");
    email = profile.email.toLowerCase();
    name = profile.name?.trim() || email.split("@")[0];
  } catch (err) {
    console.error("google oauth error", err);
    return fail(req, "failed");
  }

  // Same store as email signup, in both database and memory modes.
  const user = await findOrCreateOAuthUser({ email, name });

  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    isAdmin: user.isAdmin || isAdminEmail(user.email),
  });

  const secure = process.env.NODE_ENV === "production";
  const cookie = buildSessionCookie(token, { domain: cookieDomainFor(req.headers.get("host")), secure });

  const res = new NextResponse(null, { status: 302, headers: { Location: new URL(next, req.url).toString() } });
  res.headers.append("Set-Cookie", cookie);
  res.headers.append(
    "Set-Cookie",
    `${OAUTH_STATE_COOKIE}=; Path=/api/auth/google; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`
  );
  return res;
}
