"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthDivider, GoogleButton } from "@/components/auth/GoogleButton";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupInner />
    </Suspense>
  );
}

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/onboarding/step-1";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pre-fill name from existing onboarding state if available.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("calm-therapist:onboarding");
      if (raw) {
        const s = JSON.parse(raw) as { name?: string };
        if (s.name) setName(s.name);
      }
    } catch {}
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
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
      <h2 style={{ marginBottom: 12 }}>Continue the conversation.</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Thirty seconds to open your space — so we can pick up next time where we left off.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <GoogleButton next={next} label="Sign up with Google" />
      </div>

      <AuthDivider />

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="What should Calm Therapist call you?">
          <input
            className="input"
            type="text"
            autoComplete="given-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
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
        <Field label="Password (8+ characters)">
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
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
          {loading ? "Opening your space…" : "Open my space"}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14, color: "var(--calm-ink-40)" }}>
        Already have one?{" "}
        <Link href={`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} style={{ color: "var(--calm-forest)" }}>
          Sign in
        </Link>
      </p>

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--calm-ink-40)", lineHeight: 1.6 }}>
        We don&apos;t train models on your conversations. We don&apos;t sell your data. You can delete
        everything anytime — it&apos;s in our{" "}
        <Link href="/privacy" style={{ color: "var(--calm-forest)" }}>
          privacy architecture
        </Link>
        .
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
