/**
 * Environment validation.
 *
 * In production the app refuses to serve without the variables that keep
 * sessions, data, and admin access safe. In development everything is
 * optional so the demo still runs, and each missing variable is logged once.
 *
 * Notes:
 * - Env vars are read with static `process.env.NAME` references so the
 *   check also works in the edge runtime (middleware), which only inlines
 *   static references.
 * - The check is skipped during `next build` (NEXT_PHASE), because build
 *   machines often do not carry runtime secrets. It runs on the first request.
 *
 * Import this module from lib/auth.ts and lib/prisma.ts.
 */

const isProd = process.env.NODE_ENV === "production";
const isBuild = process.env.NEXT_PHASE === "phase-production-build";

interface Rule {
  name: string;
  why: string;
  value: () => string | undefined;
  /** When this returns true the rule is waived. */
  waived?: () => boolean;
}

const REQUIRED: Rule[] = [
  {
    name: "AUTH_SECRET",
    why: "signs session cookies; without it anyone could forge an admin session",
    value: () => process.env.AUTH_SECRET,
  },
  {
    name: "DATABASE_URL",
    why: "persists users and quotas; without it data lives per serverless instance and is lost",
    value: () => process.env.DATABASE_URL,
    waived: () => process.env.ALLOW_MEMORY_STORE === "1",
  },
  { name: "ADMIN_EMAIL", why: "the one account allowed into /admin", value: () => process.env.ADMIN_EMAIL },
  {
    name: "ADMIN_INITIAL_PASSWORD",
    why: "initial admin password; a default would be public",
    value: () => process.env.ADMIN_INITIAL_PASSWORD,
  },
];

const RECOMMENDED: Rule[] = [
  { name: "OPENAI_API_KEY", why: "Aura runs on a mock stream without it", value: () => process.env.OPENAI_API_KEY },
  { name: "RESEND_API_KEY", why: "emails are logged instead of sent", value: () => process.env.RESEND_API_KEY },
  { name: "CRON_SECRET", why: "the email processor endpoint is public without it", value: () => process.env.CRON_SECRET },
];

const globalAny = globalThis as unknown as { __calmEnvChecked?: boolean };

export function assertEnv(): void {
  if (globalAny.__calmEnvChecked || isBuild) return;
  globalAny.__calmEnvChecked = true;

  const missing = REQUIRED.filter((r) => !r.value() && !(r.waived && r.waived()));

  if (missing.length && isProd) {
    const lines = missing.map((r) => `  - ${r.name}: ${r.why}`).join("\n");
    throw new Error(`[calm-therapist] Refusing to serve in production. Missing environment variables:\n${lines}`);
  }
  if (missing.length) {
    console.warn(
      `[calm-therapist] Development mode without: ${missing.map((r) => r.name).join(", ")}. Required in production.`
    );
  }

  const soft = RECOMMENDED.filter((r) => !r.value());
  if (soft.length) {
    console.warn(`[calm-therapist] Not configured: ${soft.map((r) => `${r.name} (${r.why})`).join("; ")}.`);
  }
}

/**
 * The session signing secret. In production it must be set and at least
 * 32 characters. In development a random per-process secret is used so a
 * leaked value is never reusable; sessions reset on restart.
 */
export function authSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (isProd && !isBuild) {
    throw new Error("[calm-therapist] AUTH_SECRET must be set and at least 32 characters in production.");
  }
  const g = globalThis as unknown as { __calmDevSecret?: string };
  if (!g.__calmDevSecret) {
    g.__calmDevSecret = `dev-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}${Date.now()}`;
    if (!isBuild) console.warn("[calm-therapist] AUTH_SECRET not set; using a random development secret.");
  }
  return g.__calmDevSecret;
}
