"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}

function ResetInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div>
        <h2 style={{ marginBottom: 12 }}>This link is missing its code.</h2>
        <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 24 }}>
          Request a fresh reset and we&apos;ll send a working one.
        </p>
        <Link href="/auth/forgot" className="btn-primary">Send another link</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reset password.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/auth/login"), 1500);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div>
        <h2 style={{ marginBottom: 12 }}>Password updated.</h2>
        <p className="body-large" style={{ color: "var(--calm-ink-40)" }}>Taking you to sign in…</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Set a new password.</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Choose something you&apos;ll remember — at least 8 characters.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>New password</span>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>Confirm new password</span>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>

        {error && (
          <p style={{ fontSize: 14, color: "var(--calm-ink)", background: "var(--calm-mist)", padding: "10px 14px", borderRadius: 8 }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
