"use client";

import { Style } from "@/components/ui/Style";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Site-wide lead-magnet popup.
 *
 * Rules:
 * - Renders only on marketing pages (anything outside /auth, /dashboard,
 *   /onboarding, /api, /lp). The /lp/* campaign pages have their own funnel.
 * - Hidden for users who already have a session cookie.
 * - Hidden permanently after the visitor submits an email.
 * - Soft-dismissible: closing it sets a 5-minute cooldown (timestamp in
 *   localStorage), after which it can resurface.
 * - Triggers:
 *     1. Time on page — first visit waits longer than subsequent ones.
 *     2. After ~3 page views in a session, surfaces almost immediately.
 *     3. Exit-intent (cursor leaves through the top of the viewport).
 * - Each route change re-runs the eligibility check, so it can re-appear
 *   when the visitor is browsing through marketing pages.
 */

const DISMISS_KEY = "calm-therapist:lead-popup-dismissed-at";
const SUBMITTED_KEY = "calm-therapist:lead-popup-submitted";
const PAGEVIEW_KEY = "calm-therapist:lead-popup-pageviews";

const COOLDOWN_MS = 5 * 60 * 1000;        // 5 minutes after dismiss
const FIRST_VISIT_DELAY_MS = 22_000;      // 22s on the first page
const SUBSEQUENT_DELAY_MS = 28_000;       // 28s on each subsequent page
const PRIMED_DELAY_MS = 6_000;            // fast trigger after a few page views
const PRIMED_AFTER_PAGEVIEWS = 3;
const SOURCE = "site-popup";

const EXCLUDED_PREFIXES = ["/auth", "/dashboard", "/onboarding", "/api", "/lp"];

function isMarketingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return !EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));
}

function shouldRespectCooldown(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = window.localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    return Date.now() - Number(v) < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function alreadySubmitted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

function bumpPageviews(): number {
  if (typeof window === "undefined") return 0;
  try {
    const cur = Number(window.sessionStorage.getItem(PAGEVIEW_KEY) ?? "0") + 1;
    window.sessionStorage.setItem(PAGEVIEW_KEY, String(cur));
    return cur;
  } catch {
    return 0;
  }
}

export function LeadPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const lastTriggeredPath = useRef<string | null>(null);

  // Check auth state once on mount. Signed-in users never see the popup.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data: { user: unknown }) => {
        if (!cancelled) setAuthenticated(!!data.user);
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const eligibleRoute = isMarketingPath(pathname);
  const eligible =
    eligibleRoute && authenticated === false && !alreadySubmitted();

  useEffect(() => {
    if (!eligible) {
      // If we navigate to an excluded route, hide any open popup.
      if (open) setOpen(false);
      return;
    }

    // Don't restart timers while the popup is already showing.
    if (open) return;

    // Track the page view for this route.
    const pageviews = bumpPageviews();

    // Respect cooldown after a dismissal.
    if (shouldRespectCooldown()) return;

    // Don't re-trigger immediately on the same path (e.g. a re-render).
    if (lastTriggeredPath.current === pathname) return;

    const delay =
      pageviews >= PRIMED_AFTER_PAGEVIEWS
        ? PRIMED_DELAY_MS
        : pageviews <= 1
        ? FIRST_VISIT_DELAY_MS
        : SUBSEQUENT_DELAY_MS;

    const timer = window.setTimeout(() => {
      if (shouldRespectCooldown()) return;
      lastTriggeredPath.current = pathname;
      setSubmitted(false);
      setError(null);
      setOpen(true);
    }, delay);

    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shouldRespectCooldown()) {
        lastTriggeredPath.current = pathname;
        setOpen(true);
      }
    };
    document.addEventListener("mouseleave", onExit);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onExit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, eligible]);

  const dismiss = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `${SOURCE}:${pathname ?? "/"}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setSubmitted(true);
        try {
          window.localStorage.setItem(SUBMITTED_KEY, "1");
        } catch {}
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render the chrome at all on excluded routes or for signed-in users.
  if (!eligibleRoute || authenticated !== false) return null;

  const headline = headlineForPath(pathname);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="lead-popup"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="lead-popup"
            role="dialog"
            aria-label="Start a free Calm Therapist session"
          >
            <button
              type="button"
              className="lead-popup-close"
              onClick={dismiss}
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {!submitted ? (
              <>
                <span className="micro-label" style={{ color: "var(--calm-forest)" }}>
                  Start free
                </span>
                <h4 style={{ marginTop: 10, marginBottom: 8 }}>{headline}</h4>
                <p style={{ fontSize: 14, color: "var(--calm-ink-70)", lineHeight: 1.6, marginBottom: 16 }}>
                  Drop your email and Calm Therapist will hold your spot. Your first conversation
                  is one minute away.
                </p>
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    type="email"
                    required
                    placeholder="you@somewhere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    style={{ height: 44 }}
                  />
                  <button type="submit" className="btn-primary" disabled={loading} style={{ height: 44 }}>
                    {loading ? "…" : "Start free session"}
                  </button>
                  {error && (
                    <p style={{ fontSize: 13, color: "var(--calm-ink)" }}>{error}</p>
                  )}
                </form>
                <p style={{ marginTop: 12, fontSize: 11, color: "var(--calm-ink-40)", lineHeight: 1.5 }}>
                  We don&apos;t train on your messages. Backed by Implenix.
                </p>
              </>
            ) : (
              <>
                <span className="micro-label" style={{ color: "var(--calm-forest)" }}>
                  Saved
                </span>
                <h4 style={{ marginTop: 10, marginBottom: 8 }}>
                  Take a breath. We&apos;re ready when you are.
                </h4>
                <p style={{ fontSize: 14, color: "var(--calm-ink-70)", lineHeight: 1.6, marginBottom: 16 }}>
                  Continue to your account — onboarding takes about 3 minutes and Calm Therapist
                  will know you by the end.
                </p>
                <Link
                  href={`/auth/signup?email=${encodeURIComponent(email)}`}
                  className="btn-primary"
                  style={{ width: "100%", height: 44 }}
                >
                  Continue to your account
                </Link>
                <p style={{ marginTop: 12, fontSize: 11, color: "var(--calm-ink-40)" }}>
                  Or{" "}
                  <Link href="/auth/login" style={{ color: "var(--calm-forest)" }}>
                    sign in
                  </Link>
                  .
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Style>{`
        .lead-popup {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 60;
          width: 360px;
          max-width: calc(100vw - 32px);
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 24px 60px rgba(45, 45, 45, 0.16);
        }
        .lead-popup-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          color: var(--calm-ink-40);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .lead-popup-close:hover {
          background: var(--calm-ink-10);
          color: var(--calm-ink);
        }
        @media (max-width: 600px) {
          .lead-popup {
            right: 12px;
            left: 12px;
            bottom: 12px;
            width: auto;
          }
        }
      `}</Style>
    </>
  );
}

function headlineForPath(pathname: string | null): string {
  if (!pathname) return "Try one session — no signup screen first.";
  if (pathname.startsWith("/for/anxiety")) return "Anxiety doesn't wait. Neither does Calm Therapist.";
  if (pathname.startsWith("/for/depression")) return "Coming back doesn't have to be hard.";
  if (pathname.startsWith("/for/grief")) return "Memory matters most when it's grief.";
  if (pathname.startsWith("/for/burnout")) return "See the shape of your week — for free.";
  if (pathname.startsWith("/for/relationships")) return "See the pattern. Then see what to do with it.";
  if (pathname.startsWith("/blog")) return "If this is hitting close, try one session.";
  if (pathname.startsWith("/features")) return "These features are free to start.";
  if (pathname.startsWith("/privacy")) return "Privacy you can verify. A session you can try.";
  if (pathname.startsWith("/how-it-works")) return "Reading about it is fine. Trying it is faster.";
  return "Try one session — no signup screen first.";
}
