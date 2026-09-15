"use client";

/**
 * One way for the dashboard to talk to the API.
 *
 * Every page used to do this:
 *
 *   fetch("/api/thing").then(r => r.ok ? r.json() : null).catch(() => {})
 *
 * which fails in the worst possible way. A 401 becomes null, null becomes an
 * early return, and the page sits on its loading state forever — no error, no
 * retry, no sign-in prompt. A member whose session has expired sees a blank
 * dashboard and concludes the product is broken, which is a reasonable thing
 * to conclude. The same silence hides a 500, a dropped connection, and a
 * backend that is still waking up.
 *
 * This does three things instead: sends an expired session back to sign-in
 * with a path to return to, hands the caller a real message when something
 * else goes wrong, and never throws into an unhandled rejection.
 */

export interface ApiResult<T> {
  data: T | null;
  /** Human-readable, safe to render. Null when the call succeeded. */
  error: string | null;
  status: number;
}

function toLogin(): void {
  if (typeof window === "undefined") return;
  const next = window.location.pathname + window.location.search;
  window.location.href = `/auth/login?next=${encodeURIComponent(next)}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(path, { cache: "no-store", ...init });
  } catch {
    return { data: null, error: "Could not reach the server. Check your connection.", status: 0 };
  }

  if (res.status === 401) {
    // The session is gone. Sitting here showing nothing is the one thing that
    // is never the right answer.
    toLogin();
    return { data: null, error: "Your session expired. Taking you to sign in.", status: 401 };
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      (body as { error?: string } | null)?.error ??
      (res.status >= 500
        ? "Something went wrong on our side. Try again in a moment."
        : "That did not work.");
    return { data: null, error: message, status: res.status };
  }

  return { data: (body as T) ?? null, error: null, status: res.status };
}
