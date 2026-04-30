import { NextResponse } from "next/server";
import { exchangeCode, fetchProfile, isConfigured } from "@/lib/google-oauth";
import { buildSessionCookie, cookieDomainFor, isAdminEmail, signSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: "free" | "pro";
  createdAt: string;
}

export async function GET(req: Request) {
  if (!isConfigured()) {
    return NextResponse.redirect(new URL("/auth/login?google=unavailable", req.url));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const next = state ? decodeURIComponent(state) : "/dashboard";
  if (!code) return NextResponse.redirect(new URL("/auth/login?google=cancelled", req.url));

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ?? `${url.origin}/api/auth/google/callback`;

  let email: string;
  let name: string;
  try {
    const tokens = await exchangeCode(code, redirectUri);
    const profile = await fetchProfile(tokens.access_token);
    email = profile.email.toLowerCase();
    name = profile.name?.trim() || email.split("@")[0];
  } catch (err) {
    console.error("google oauth error", err);
    return NextResponse.redirect(new URL("/auth/login?google=failed", req.url));
  }

  // Lazy-load user store to avoid circular deps.
  const globalAny = globalThis as unknown as { __calmUsers?: Map<string, UserRecord> };
  if (!globalAny.__calmUsers) globalAny.__calmUsers = new Map();
  const store = globalAny.__calmUsers;

  let user = store.get(email);
  if (!user) {
    const passwordHash = await bcrypt.hash(`google:${Date.now()}:${Math.random()}`, 10);
    user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email,
      name,
      passwordHash,
      plan: "free",
      createdAt: new Date().toISOString(),
    };
    store.set(email, user);
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    isAdmin: isAdminEmail(user.email),
  });

  const cookie = buildSessionCookie(token, {
    domain: cookieDomainFor(req.headers.get("host")),
    secure: process.env.NODE_ENV === "production",
  });

  const dest = new URL(next.startsWith("/") ? next : "/dashboard", req.url);
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: dest.toString(),
      "Set-Cookie": cookie,
    },
  });
}
