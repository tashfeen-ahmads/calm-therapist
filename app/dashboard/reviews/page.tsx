"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Style } from "@/components/ui/Style";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  publicConsent: boolean;
  state: "published" | "pending" | "not-published";
  adminResponse?: string;
  respondedAt?: string;
}

/**
 * A member's own reviews.
 *
 * Two jobs. It shows them what they said and what happened to it, so leaving
 * feedback does not feel like shouting into a void. And it lets them leave
 * another one, because how Aura is going changes over months and the review
 * from week one stops being true.
 */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [writing, setWriting] = useState(false);

  const load = useCallback(() => {
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setReviews(d.reviews))
      .catch(() => setReviews([]));
  }, []);

  useEffect(load, [load]);

  return (
    <div style={{ padding: "48px 24px", maxWidth: 780, margin: "0 auto" }}>
      <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>Your reviews</p>
      <h2 style={{ marginBottom: 8 }}>How has it been?</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32, maxWidth: 560 }}>
        Honest is more useful than kind. A low rating tells us more than a high one, and it changes
        nothing about your account.
      </p>

      {!writing && (
        <button type="button" className="btn-primary" onClick={() => setWriting(true)} style={{ marginBottom: 32 }}>
          Write a review
        </button>
      )}

      {writing && (
        <ReviewForm
          onDone={() => {
            setWriting(false);
            load();
          }}
          onCancel={() => setWriting(false)}
        />
      )}

      {reviews === null ? (
        <p style={{ fontSize: 14, color: "var(--calm-ink-40)" }}>One moment…</p>
      ) : reviews.length === 0 ? (
        <div className="card" style={{ padding: 28 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)", margin: 0 }}>
            You have not left one yet. If you have used Aura a few times, we would genuinely like to
            know how it has gone.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      <p style={{ marginTop: 32, fontSize: 13, color: "var(--calm-ink-40)", lineHeight: 1.7 }}>
        Reviews stay private between you and us unless you tick the box allowing us to quote you,
        and even then a person reads it before anything appears on the public site. You can ask us
        to take one down at any time.{" "}
        <Link href="/dashboard/settings" style={{ color: "var(--calm-forest)" }}>Preferences</Link>
      </p>

      <Style>{`
        .review-state { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; }
      `}</Style>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const tone =
    review.state === "published"
      ? { bg: "var(--calm-forest-10)", fg: "var(--calm-forest)", label: "On the site" }
      : review.state === "pending"
      ? { bg: "var(--calm-mist)", fg: "var(--calm-ink-70)", label: "With us" }
      : { bg: "var(--calm-white)", fg: "var(--calm-ink-40)", label: "Kept private" };

  return (
    <article className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <span aria-label={`${review.rating} out of 5`} style={{ color: "var(--calm-forest)", fontSize: 16, letterSpacing: 2 }}>
          {"★".repeat(review.rating)}
          <span style={{ color: "var(--calm-ink-10)" }}>{"★".repeat(5 - review.rating)}</span>
        </span>
        <span className="review-state" style={{ background: tone.bg, color: tone.fg }}>{tone.label}</span>
      </div>

      {review.comment && (
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--calm-ink)", margin: "0 0 12px" }}>{review.comment}</p>
      )}

      <p style={{ fontSize: 12, color: "var(--calm-ink-40)", margin: 0 }}>
        {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        {review.state === "pending" && review.publicConsent ? " · waiting for someone to read it" : ""}
        {review.state === "not-published" && review.publicConsent
          ? " · not going on the public site, but we read it"
          : ""}
      </p>

      {review.adminResponse && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--calm-ink-10)" }}>
          <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 6 }}>Our reply</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--calm-ink-70)", margin: 0 }}>{review.adminResponse}</p>
        </div>
      )}
    </article>
  );
}

function ReviewForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Pick a number of stars first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, publicConsent: consent }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save that.");
        return;
      }
      if (data.duplicate) {
        setError("You left one in the last week. Give it a little longer and tell us again.");
        return;
      }
      onDone();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ padding: 28, marginBottom: 32, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }} role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            aria-pressed={rating === n}
            onClick={() => setRating(n)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: rating >= n ? "var(--calm-forest)" : "transparent",
              color: rating >= n ? "white" : "var(--calm-ink-40)",
              border: "1px solid " + (rating >= n ? "var(--calm-forest)" : "var(--calm-ink-10)"),
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="input"
        rows={4}
        placeholder="What has worked, and what has not?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ resize: "vertical" }}
      />

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--calm-ink-70)", lineHeight: 1.6 }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
        <span>
          You may quote me on the public site, first name only. Someone will read it first, and I can
          ask for it to come down any time.
        </span>
      </label>

      {error && <p style={{ fontSize: 13, color: "var(--calm-ink)", margin: 0 }}>{error}</p>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Send it"}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
