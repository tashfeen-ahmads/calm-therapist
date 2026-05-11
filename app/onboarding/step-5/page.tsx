"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OnboardingShell, readState } from "@/components/onboarding/OnboardingShell";
import { Logo } from "@/components/ui/Logo";

interface Snapshot {
  name?: string;
  tone?: string;
  goals?: string[];
  focusAreas?: string[];
  language?: string;
}

export default function Step5Page() {
  const [snap, setSnap] = useState<Snapshot>({});
  const [reflection, setReflection] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = readState() as Snapshot;
    setSnap(s);
    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    })
      .then((r) => r.json())
      .then((data: { reflection?: string }) => setReflection(data.reflection ?? FALLBACK(s)))
      .catch(() => setReflection(FALLBACK(s)))
      .finally(() => setLoading(false));

    // Persist onboarding to the user row so it survives a fresh browser.
    // No-ops in memory mode (no DATABASE_URL) and for signed-out users.
    fetch("/api/users/me/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    }).catch(() => {});
  }, []);

  return (
    <OnboardingShell step={5}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-block", marginBottom: 24 }}>
          <Logo animated href={null} size={64} showWordmark={false} />
        </div>
        <h2 style={{ marginBottom: 16 }}>Calm Therapist is ready for you.</h2>
        <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 40 }}>
          Here&apos;s what Calm Therapist knows about you so far:
        </p>
      </div>

      <div className="card-mist" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>
          Reflection
        </p>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            lineHeight: 1.5,
            fontStyle: "italic",
            color: "var(--calm-ink)",
          }}
        >
          {loading ? "…" : reflection || FALLBACK(snap)}
        </p>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <SummaryRow label="Name" value={snap.name ?? "—"} />
        <SummaryRow label="Tone" value={snap.tone ?? "warm"} />
        <SummaryRow label="Focus" value={(snap.focusAreas ?? []).join(", ") || "—"} />
        <SummaryRow label="Goals" value={(snap.goals ?? []).join(" · ") || "—"} last />
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/dashboard/session?mode=voice" className="btn-primary">
          Start with voice
        </Link>
        <Link href="/dashboard/session?mode=chat" className="btn-ghost">
          Start with chat
        </Link>
      </div>
    </OnboardingShell>
  );
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: last ? "none" : "1px solid var(--calm-ink-10)",
        gap: 24,
      }}
    >
      <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>{label}</span>
      <span style={{ fontSize: 14, textAlign: "right", color: "var(--calm-ink)" }}>{value}</span>
    </div>
  );
}

function FALLBACK(s: Snapshot) {
  const name = s.name ?? "you";
  const focus = (s.focusAreas ?? []).slice(0, 2).join(" and ").toLowerCase();
  return `So, ${name} — what brings you here is ${focus || "something worth taking seriously"}. Calm Therapist will hold what you share, and build on every session. We can start whenever you're ready.`;
}
