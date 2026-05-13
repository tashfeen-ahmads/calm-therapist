"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}

function VerifyInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This link is missing its confirmation code.");
      return;
    }
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (r.ok) {
          setStatus("ok");
          setMessage(data.email ? `${data.email} is confirmed.` : "Confirmed.");
        } else {
          setStatus("error");
          setMessage(data.error ?? "This link is expired or already used.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Try again.");
      });
  }, [token]);

  return (
    <div>
      {status === "loading" && (
        <>
          <h2 style={{ marginBottom: 12 }}>Confirming your email…</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-40)" }}>One moment.</p>
        </>
      )}
      {status === "ok" && (
        <>
          <h2 style={{ marginBottom: 12 }}>You&apos;re confirmed.</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 24 }}>{message}</p>
          <Link href="/dashboard" className="btn-primary">Open your space</Link>
        </>
      )}
      {status === "error" && (
        <>
          <h2 style={{ marginBottom: 12 }}>This link didn&apos;t work.</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 24 }}>{message}</p>
          <p style={{ fontSize: 14, color: "var(--calm-ink-40)" }}>
            Sign in and we&apos;ll send a fresh one from <Link href="/dashboard/settings" style={{ color: "var(--calm-forest)" }}>Settings</Link>.
          </p>
        </>
      )}
    </div>
  );
}
