"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div>
        <h2 style={{ marginBottom: 12 }}>Check your email.</h2>
        <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 24 }}>
          If that address is on file, a reset link is on its way. It&apos;s good for one hour.
        </p>
        <Link href="/auth/login" className="btn-ghost">Back to sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Reset your password.</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Drop your email and we&apos;ll send a one-hour reset link.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>Email</span>
          <input
            className="input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14, color: "var(--calm-ink-40)" }}>
        Remembered it?{" "}
        <Link href="/auth/login" style={{ color: "var(--calm-forest)" }}>Sign in</Link>
      </p>
    </div>
  );
}
