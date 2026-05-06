"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthDivider, GoogleButton } from "@/components/auth/GoogleButton";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not sign in.");
      } else {
        router.push(next);
        router.refresh();
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Welcome back.</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Pick up where we left off.
      </p>

      <div
        style={{
          marginBottom: 24,
          padding: "12px 16px",
          background: "var(--calm-mist)",
          borderRadius: 10,
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--calm-ink)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 500 }}>Demo admin (development)</span>
        <span style={{ color: "var(--calm-ink-70)" }}>
          email <code>admin@calmtherapist.local</code> · password <code>admin1234</code>
        </span>
        <button
          type="button"
          onClick={() => {
            setEmail("admin@calmtherapist.local");
            setPassword("admin1234");
          }}
          className="btn-ghost"
          style={{ alignSelf: "flex-start", height: 32, fontSize: 12 }}
        >
          Fill demo admin
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <GoogleButton next={next} label="Sign in with Google" />
      </div>

      {params.get("google") === "unavailable" && (
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--calm-ink-40)" }}>
          Google sign-in needs <code>GOOGLE_CLIENT_ID</code> configured. Use email & password for now.
        </p>
      )}

      <AuthDivider />

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Email">
          <input
            className="input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password">
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error && (
          <p style={{ fontSize: 14, color: "var(--calm-ink)", background: "var(--calm-mist)", padding: "10px 14px", borderRadius: 8 }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "Thinking with you…" : "Continue"}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14, color: "var(--calm-ink-40)" }}>
        New here?{" "}
        <Link href={`/auth/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} style={{ color: "var(--calm-forest)" }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>{label}</span>
      {children}
    </label>
  );
}
