"use client";

import { Style } from "@/components/ui/Style";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readState } from "@/components/onboarding/OnboardingShell";
import { FeedbackPrompt } from "@/components/dashboard/FeedbackPrompt";
import { UpgradePopup } from "@/components/billing/UpgradePopup";

const MOOD_LABELS = ["Struggling", "Low", "Okay", "Good", "Settled"];

export default function DashboardHome() {
  const router = useRouter();
  const [name, setName] = useState("friend");
  const [mood, setMood] = useState<number | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const s = readState() as Record<string, string>;
    if (s.name) setName(s.name);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d: { user?: { plan?: "free" | "pro" } }) => {
        if (d.user?.plan === "pro") setPlan("pro");
      })
      .catch(() => {});
  }, []);

  const greeting = useGreeting();

  const onVoiceClick = () => {
    if (plan === "pro") router.push("/dashboard/voice");
    else setShowUpgrade(true);
  };

  return (
    <div style={{ padding: "48px 32px", maxWidth: 980, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>
        {greeting}, {name}.
      </h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}.
      </p>

      <div className="start-grid" style={{ marginBottom: 40 }}>
        <Link href="/dashboard/session" className="start-card">
          <div className="start-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 5h18v12H8l-5 4z" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="start-card-body">
            <h3>Talk it out — text</h3>
            <p>Type at your own pace. Always open. Free.</p>
          </div>
          <span className="start-card-arrow">→</span>
        </Link>

        <button type="button" onClick={onVoiceClick} className="start-card start-card-voice" data-locked={plan === "free" ? "true" : "false"}>
          <div className="start-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
            </svg>
          </div>
          <div className="start-card-body">
            <h3>
              Talk it out — voice
              {plan === "free" && <span className="start-card-badge">Pro</span>}
            </h3>
            <p>
              {plan === "free"
                ? "Unlock voice with a paid space — 20 min/week included."
                : "Speak when typing's too much. 20 min a week, included."}
            </p>
          </div>
          <span className="start-card-arrow">{plan === "free" ? "🔒" : "→"}</span>
        </button>
      </div>

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

      <div style={{ marginTop: 32 }}>
        <FeedbackPrompt />
      </div>

      <UpgradePopup
        open={showUpgrade}
        reason="Voice is part of keeping your space open."
        onClose={() => setShowUpgrade(false)}
        onUpgraded={() => {
          setShowUpgrade(false);
          setPlan("pro");
        }}
      />

      <Style>{`
        @media (max-width: 760px) { .dash-grid { grid-template-columns: 1fr !important; } }
        .start-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 700px) { .start-grid { grid-template-columns: 1fr !important; } }
        .start-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-radius: 14px;
          padding: 22px 24px;
          text-align: left;
          color: var(--calm-ink);
          font-family: var(--font-body);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          width: 100%;
          text-decoration: none;
        }
        .start-card:hover {
          background: var(--calm-mist);
          transform: translateY(-1px);
        }
        .start-card-voice[data-locked="true"] {
          background: var(--calm-mist);
        }
        .start-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--calm-forest-10);
          color: var(--calm-forest);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .start-card-body { flex: 1; min-width: 0; }
        .start-card-body h3 {
          font-size: 18px;
          line-height: 1.2;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .start-card-body p {
          font-size: 13px;
          color: var(--calm-ink-70);
          line-height: 1.55;
          margin: 0;
        }
        .start-card-arrow {
          font-size: 20px;
          color: var(--calm-ink-40);
        }
        .start-card-badge {
          padding: 2px 8px;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--calm-forest);
          color: white;
          border-radius: 999px;
        }
      `}</Style>
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
