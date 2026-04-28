"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readState } from "@/components/onboarding/OnboardingShell";

const MOOD_LABELS = ["Struggling", "Low", "Okay", "Good", "Settled"];

export default function DashboardHome() {
  const [name, setName] = useState("friend");
  const [mood, setMood] = useState<number | null>(null);

  useEffect(() => {
    const s = readState() as Record<string, string>;
    if (s.name) setName(s.name);
  }, []);

  const greeting = useGreeting();

  return (
    <div style={{ padding: "48px 32px", maxWidth: 980, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>
        {greeting}, {name}.
      </h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 48 }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}.
        You&apos;ve had three conversations about work this week.
      </p>

      <section className="card" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          Today&apos;s check-in
        </p>
        <h3 style={{ marginBottom: 24 }}>How are you arriving today?</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setMood(n)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                border: mood === n ? "2px solid var(--calm-forest)" : "1px solid var(--calm-ink-10)",
                background: mood === n ? "var(--calm-forest-10)" : "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                color: "var(--calm-ink)",
                transition: "all 0.2s ease",
              }}
              aria-label={MOOD_LABELS[n - 1]}
            >
              {n}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "var(--calm-ink-40)" }}>
          {mood ? MOOD_LABELS[mood - 1] : "Tap a number — no explanation needed."}
        </p>
        {mood !== null && (
          <Link href="/dashboard/session" className="btn-primary" style={{ marginTop: 24 }}>
            Open today&apos;s session
          </Link>
        )}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }} className="dash-grid">
        <Card title="Weekly goals">
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <GoalRow label="Sleep before midnight 3 nights" progress={2 / 3} />
            <GoalRow label="One conversation without anxiety" progress={1} />
            <GoalRow label="Walk after dinner 4 times" progress={1 / 4} />
          </ul>
        </Card>
        <Card title="Your streak">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 56, color: "var(--calm-forest)", lineHeight: 1 }}>
            7
          </p>
          <p style={{ marginTop: 12, color: "var(--calm-ink-40)" }}>days of showing up.</p>
        </Card>
      </div>

      <Card title="Recent sessions">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
          <SessionRow date="Apr 26" mode="Voice" summary="The same argument with your wife came up. You stayed, this time." />
          <SessionRow date="Apr 24" mode="Chat" summary="Sleep is improving on the nights you walk." />
          <SessionRow date="Apr 22" mode="Voice" summary="Tuesdays again. You named the trigger more directly." />
        </ul>
      </Card>

      <style>{`
        @media (max-width: 760px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>{title}</p>
      {children}
    </div>
  );
}

function GoalRow({ label, progress }: { label: string; progress: number }) {
  const filled = progress >= 1;
  return (
    <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          border: "2px solid var(--calm-forest)",
          background: filled ? "var(--calm-forest)" : "transparent",
          display: "inline-flex",
          flexShrink: 0,
        }}
        aria-label={`${Math.round(progress * 100)}% complete`}
      />
      <span style={{ fontSize: 14 }}>{label}</span>
    </li>
  );
}

function SessionRow({ date, mode, summary }: { date: string; mode: string; summary: string }) {
  return (
    <li
      style={{
        padding: "16px 0",
        borderBottom: "1px solid var(--calm-ink-10)",
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 80 }}>
        <p style={{ fontSize: 13, color: "var(--calm-ink-40)" }}>{date}</p>
        <p className="body-micro" style={{ color: "var(--calm-forest)" }}>{mode}</p>
      </div>
      <p style={{ fontSize: 15, color: "var(--calm-ink)", flex: 1, minWidth: 240 }}>{summary}</p>
    </li>
  );
}

function useGreeting() {
  const [g, setG] = useState("Hello");
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setG("Good morning");
    else if (h < 18) setG("Good afternoon");
    else setG("Good evening");
  }, []);
  return g;
}
