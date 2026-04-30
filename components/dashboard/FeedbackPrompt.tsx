"use client";

import { useState } from "react";

const STORAGE_KEY = "calm-therapist:feedback-given";
const DISMISS_KEY = "calm-therapist:feedback-dismissed";

interface Props {
  /** show only after the user has had at least one session in this device */
  initialOpen?: boolean;
}

export function FeedbackPrompt({ initialOpen = true }: Props) {
  const [given, setGiven] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thanks, setThanks] = useState<null | "positive" | "neutral" | "needs-attention">(null);
  const [error, setError] = useState<string | null>(null);

  if (!initialOpen || given || dismissed) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Tap a star first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, publicConsent: consent && rating >= 4 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save your feedback.");
      } else {
        setThanks(data.category);
        try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch {}
        setGiven(true);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const dismiss = () => {
    try { window.localStorage.setItem(DISMISS_KEY, "1"); } catch {}
    setDismissed(true);
  };

  if (thanks) {
    return (
      <div className="card-mist" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 8 }}>
          Thank you
        </p>
        <h3 style={{ marginBottom: 8 }}>
          {thanks === "positive"
            ? "We're glad it landed for you."
            : thanks === "needs-attention"
            ? "We hear you. Someone will read this personally."
            : "Noted. We'll keep working on it."}
        </h3>
        <p style={{ fontSize: 14, color: "var(--calm-ink-70)" }}>
          {thanks === "positive"
            ? "If you opted in, your words may show up on our public site so others can hear them."
            : "Your feedback goes straight to the team."}
        </p>
      </div>
    );
  }

  return (
    <section className="card-mist" style={{ marginBottom: 32, position: "relative" }}>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 28,
          height: 28,
          borderRadius: 999,
          color: "var(--calm-ink-40)",
          background: "transparent",
        }}
      >
        ×
      </button>
      <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>
        How are we doing?
      </p>
      <h3 style={{ marginBottom: 16 }}>One quick rating after your first session.</h3>
      <p style={{ fontSize: 14, color: "var(--calm-ink-70)", marginBottom: 16 }}>
        It takes 10 seconds. Your honest read shapes what we work on next.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 8 }} role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hover || rating) >= n;
            return (
              <button
                type="button"
                key={n}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                style={{
                  width: 40,
                  height: 40,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  background: filled ? "var(--calm-forest)" : "transparent",
                  color: filled ? "white" : "var(--calm-ink-40)",
                  border: "1px solid " + (filled ? "var(--calm-forest)" : "var(--calm-ink-10)"),
                  fontSize: 18,
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
              >
                ★
              </button>
            );
          })}
        </div>

        <textarea
          className="input"
          placeholder="Anything specific? (optional)"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ resize: "vertical" }}
        />

        {rating >= 4 && (
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--calm-ink-70)" }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            Calm Therapist may share my words on its public site (first name only).
          </label>
        )}

        {error && (
          <p style={{ fontSize: 13, color: "var(--calm-ink)", background: "var(--calm-white)", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--calm-ink-10)" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Send feedback"}
          </button>
          <button type="button" className="btn-ghost" onClick={dismiss}>
            Maybe later
          </button>
        </div>
      </form>
    </section>
  );
}
