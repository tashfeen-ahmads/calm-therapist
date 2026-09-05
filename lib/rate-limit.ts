/**
 * Sliding-window rate limiter.
 *
 * MVP: in-memory map keyed by (route, identifier). Works for single-instance
 * Next.js + Vercel single-region. For multi-region serverless, swap the store
 * for Upstash Redis (`@upstash/ratelimit`) — same API surface.
 */

interface Window {
  /** Timestamps (ms) of recent requests within the window. */
  hits: number[];
}

const globalAny = globalThis as unknown as { __calmRateLimit?: Map<string, Window> };
const store: Map<string, Window> = globalAny.__calmRateLimit ?? new Map();
globalAny.__calmRateLimit = store;

export interface RateLimitConfig {
  /** Logical bucket name (e.g. "feel-it:min"). */
  bucket: string;
  /** Window size in seconds. */
  windowSec: number;
  /** Max requests within the window. */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number; // ms until oldest hit drops out of window
}

export function rateLimit(identifier: string, cfg: RateLimitConfig): RateLimitResult {
  const key = `${cfg.bucket}:${identifier}`;
  const now = Date.now();
  const windowMs = cfg.windowSec * 1000;
  const cutoff = now - windowMs;
  const w = store.get(key) ?? { hits: [] };

  // Drop expired hits.
  w.hits = w.hits.filter((t) => t > cutoff);

  if (w.hits.length >= cfg.max) {
    store.set(key, w);
    const oldest = w.hits[0] ?? now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, oldest + windowMs - now),
    };
  }

  w.hits.push(now);
  store.set(key, w);
  return {
    allowed: true,
    remaining: cfg.max - w.hits.length,
    resetMs: windowMs,
  };
}

/**
 * Best-effort IP extraction from a Next.js Request. Falls back to a hash of
 * the user-agent + accept-language so rate-limit still works even when the
 * deployment platform doesn't forward x-forwarded-for.
 */
export function identifierFor(req: Request): string {
  // Platform-set headers first: these cannot be spoofed by the client.
  const platform =
    req.headers.get("x-vercel-forwarded-for") ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("fly-client-ip");
  if (platform) return platform.split(",")[0].trim();
  // Behind a generic proxy the LAST hop is the one the proxy appended.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  const ua = req.headers.get("user-agent") ?? "";
  const al = req.headers.get("accept-language") ?? "";
  return `fp:${hashString(ua + "|" + al)}`;
}

function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}
