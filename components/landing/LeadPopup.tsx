"use client";

import { Style } from "@/components/ui/Style";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DISMISS_KEY = "calm-therapist:lead-popup-dismissed";
const SHOW_DELAY_MS = 22_000; // appear after ~22s on page
const SOURCE = "landing-popup";

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY)) return;

    const timer = window.setTimeout(() => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setOpen(true);
    }, SHOW_DELAY_MS);

    const onExit = (e: MouseEvent) => {
      if (triggeredRef.current) return;
      // Cursor leaves through top of viewport — exit-intent.
      if (e.clientY <= 0) {
        triggeredRef.current = true;
        setOpen(true);
      }
    };
    document.addEventListener("mouseleave", onExit);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onExit);
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
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
        body: JSON.stringify({ email, source: SOURCE }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setSubmitted(true);
        try {
          window.localStorage.setItem(DISMISS_KEY, "1");
        } catch {}
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
                <h4 style={{ marginTop: 10, marginBottom: 8 }}>
                  Try one session — no signup screen first.
                </h4>
                <p style={{ fontSize: 14, color: "var(--calm-ink-70)", lineHeight: 1.6, marginBottom: 16 }}>
                  Drop your email and we&apos;ll keep your spot. You can have your first
                  conversation in under a minute.
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
                  Continue to onboarding — it takes about 3 minutes and Calm Therapist will know
                  you by the end.
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
                  <Link href="/onboarding/step-1" style={{ color: "var(--calm-forest)" }}>
                    explore without an account first
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
