import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "calm-therapist-development-secret-change-me"
);
const ISSUER = "calm-therapist";
const COOKIE_NAME = "calm_session";
const SESSION_DAYS = 7;

export interface SessionClaims {
  sub: string;
  email: string;
  name: string;
  plan: "free" | "pro";
  isAdmin?: boolean;
}

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(SECRET);
}

export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET, { issuer: ISSUER });
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string"
    ) {
      const plan = payload.plan === "pro" ? "pro" : "free";
      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        plan,
        isAdmin: payload.isAdmin === true,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const DEMO_ADMIN_EMAIL = "admin@calmtherapist.local";
export const DEMO_ADMIN_PASSWORD = "admin1234";

export function isAdminEmail(email: string): boolean {
  const adminEmail = (process.env.ADMIN_EMAIL ?? DEMO_ADMIN_EMAIL).trim().toLowerCase();
  if (!adminEmail) return false;
  return email.trim().toLowerCase() === adminEmail;
}

export interface CookieOpts {
  domain?: string;
  secure?: boolean;
}

export function buildSessionCookie(token: string, opts: CookieOpts = {}): string {
  const parts: string[] = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
  ];
  if (opts.secure) parts.push("Secure");
  if (opts.domain) parts.push(`Domain=${opts.domain}`);
  return parts.join("; ");
}

export function clearSessionCookie(opts: CookieOpts = {}): string {
  const parts: string[] = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (opts.secure) parts.push("Secure");
  if (opts.domain) parts.push(`Domain=${opts.domain}`);
  return parts.join("; ");
}

export const SESSION_COOKIE = COOKIE_NAME;

/**
 * Cookie-domain helper for cross-subdomain sessions (e.g. main + relax.).
 * Returns ".example.com" so a single login works on both hosts.
 * In dev (localhost), returns undefined.
 */
export function cookieDomainFor(host: string | null | undefined): string | undefined {
  if (!host) return undefined;
  const hostname = host.split(":")[0];
  if (hostname === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return undefined;
  const parts = hostname.split(".");
  if (parts.length < 2) return undefined;
  return `.${parts.slice(-2).join(".")}`;
}
