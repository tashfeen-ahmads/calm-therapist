/**
 * Only allow same-origin paths as post-login destinations. Rejects
 * protocol-relative ("//evil.com"), backslash tricks, control characters,
 * and absolute URLs. Safe to import from client components.
 */
export function safeNext(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  if (!/^\/(?![\/\\])/.test(raw)) return fallback;
  for (let i = 0; i < raw.length; i++) {
    const c = raw.charCodeAt(i);
    if (c < 32 || c === 92) return fallback;
  }
  return raw.length > 512 ? fallback : raw;
}
