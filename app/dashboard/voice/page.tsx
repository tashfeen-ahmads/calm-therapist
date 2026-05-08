"use client";

import { useEffect, useState } from "react";
import { VoiceAgent } from "@/components/agents/VoiceAgent";
import { ModeBar } from "@/components/agents/ModeBar";
import { UpgradePopup } from "@/components/billing/UpgradePopup";
import { readState } from "@/components/onboarding/OnboardingShell";
import { loadMemories } from "@/lib/memory";
import type { AgentModeKey } from "@/lib/claude";
import { DEFAULT_PROFILE, UserProfile } from "@/lib/claude";
import { Style } from "@/components/ui/Style";

interface QuotaSnapshot {
  plan: "free" | "pro";
  weeklyRemainingSec: number;
  monthlyRemainingSec: number;
  canStart: boolean;
}

export default function VoicePage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [memoryCount, setMemoryCount] = useState(0);
  const [activeMode, setActiveMode] = useState<AgentModeKey | null>(null);
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const sessionNumber = 14;

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    const memories = loadMemories();
    setMemoryCount(memories.length);
    setProfile({
      name: (s.name as string) || "friend",
      age: (s.age as string) || undefined,
      tone:
        s.tone === "direct" || s.tone === "clinical" || s.tone === "warm"
          ? (s.tone as UserProfile["tone"])
          : "warm",
      focusAreas: (s.focusAreas as string[]) ?? [],
      currentGoals: (s.goals as string[]) ?? [],
      sessionCount: sessionNumber,
      memories: memories.map((m) => m.statement),
      language: (s.language as string) ?? "en",
      culture: (s.culture as UserProfile["culture"]) ?? {
        primaryLanguage: ((s.language as string) ?? "en"),
        countryOfResidence: (s.country as string) ?? undefined,
      },
      activeModes: [],
    });
    try {
      const raw = window.sessionStorage.getItem("calm-therapist:active-mode");
      if (raw) setActiveMode(raw as AgentModeKey);
    } catch {}
    refreshQuota();
  }, []);

  const persistMode = (next: AgentModeKey | null) => {
    setActiveMode(next);
    try {
      if (next) window.sessionStorage.setItem("calm-therapist:active-mode", next);
      else window.sessionStorage.removeItem("calm-therapist:active-mode");
    } catch {}
  };

  const refreshQuota = async () => {
    try {
      const res = await fetch("/api/voice/quota");
      const data = await res.json();
      if (res.ok) setQuota(data);
    } catch {}
  };

  const isFree = quota?.plan === "free";
  const dryWeek = quota && !isFree && quota.weeklyRemainingSec <= 0;

  const profileWithMode: UserProfile = {
    ...profile,
    activeModes: activeMode ? [activeMode] : [],
  };

  return (
    <div className="voice-page">
      <header className="voice-chrome">
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
            Voice · session {sessionNumber} · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </span>
          <span style={{ fontSize: 13, color: "var(--calm-forest)", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "var(--calm-forest)" }} />
            Aura remembers {memoryCount} {memoryCount === 1 ? "thing" : "things"} about you
          </span>
        </div>
        {!isFree && <ModeBar active={activeMode} onChange={persistMode} />}
      </header>

      {isFree && <FreeBlock onUpgrade={() => setShowUpgrade(true)} />}

      {!isFree && dryWeek && (
        <OutOfMinutes
          onTopup={async () => {
            const ok = window.confirm("Top-up: $12 → 30 more minutes this week, 50 more this month. Continue?");
            if (!ok) return;
            const res = await fetch("/api/voice/topup", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
              setQuota({ plan: "pro", ...data.quota });
            } else {
              window.alert(data.error ?? "Could not apply top-up.");
            }
          }}
        />
      )}

      {!isFree && !dryWeek && quota && (
        <VoiceAgent
          profile={profileWithMode}
          onSessionEnd={(transcript) => {
            const agentTurns = transcript.filter((t) => t.role === "agent").length;
            const minutes = (agentTurns * 6) / 60;
            fetch("/api/voice/record", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ minutes }),
            })
              .then(refreshQuota)
              .catch(() => {});
          }}
        />
      )}

      <UpgradePopup
        open={showUpgrade}
        reason="Voice is part of keeping your space open."
        onClose={() => setShowUpgrade(false)}
        onUpgraded={() => {
          setShowUpgrade(false);
          refreshQuota();
        }}
      />

      <Style>{`
        .voice-page {
          padding: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .voice-chrome {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          border-bottom: 1px solid var(--calm-ink-10);
          flex-wrap: wrap;
        }
      `}</Style>
    </div>
  );
}

function FreeBlock({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div
      style={{
        margin: "32px",
        background: "var(--calm-mist)",
        border: "1px solid var(--calm-forest-20)",
        borderLeft: "3px solid var(--calm-forest)",
        borderRadius: 14,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 720,
      }}
    >
      <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Voice is part of keeping your space open</p>
      <h3>Voice unlocks when you upgrade.</h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>
        Voice costs more to run than text, so it sits behind the paid plan. 20 minutes a week
        included.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={onUpgrade} className="btn-primary">See your options</button>
      </div>
    </div>
  );
}

function OutOfMinutes({ onTopup }: { onTopup: () => void }) {
  return (
    <div
      style={{
        margin: "32px",
        background: "var(--calm-white)",
        border: "1px solid var(--calm-ink-10)",
        borderRadius: 14,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 720,
      }}
    >
      <p className="body-micro" style={{ color: "var(--calm-forest)" }}>You&apos;ve used your voice minutes for this week</p>
      <h3>We&apos;ve talked a lot. Let&apos;s rest the voice for a bit.</h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>
        Voice resets Monday. Until then text is open and waiting. If you need voice now, a
        one-time top-up of $12 adds 30 more minutes this week and 50 more for the month.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={onTopup} className="btn-primary">Top up · $12</button>
        <a href="/dashboard/session" className="btn-ghost">Switch to text</a>
      </div>
    </div>
  );
}
