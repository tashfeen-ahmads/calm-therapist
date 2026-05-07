"use client";

import { useEffect, useState } from "react";
import { VoiceAgent } from "@/components/agents/VoiceAgent";
import { UpgradePopup } from "@/components/billing/UpgradePopup";
import { readState } from "@/components/onboarding/OnboardingShell";
import { loadMemories } from "@/lib/memory";
import { DEFAULT_PROFILE, UserProfile } from "@/lib/claude";
import { Style } from "@/components/ui/Style";

interface QuotaSnapshot {
  plan: "free" | "pro";
  weeklyLimitSec: number;
  weeklyUsedSec: number;
  weeklyRemainingSec: number;
  monthlyLimitSec: number;
  monthlyUsedSec: number;
  monthlyRemainingSec: number;
  canStart: boolean;
}

export default function VoicePage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    const memories = loadMemories();
    setProfile({
      name: (s.name as string) || "friend",
      age: (s.age as string) || undefined,
      tone:
        s.tone === "direct" || s.tone === "clinical" || s.tone === "warm"
          ? (s.tone as UserProfile["tone"])
          : "warm",
      focusAreas: (s.focusAreas as string[]) ?? [],
      currentGoals: (s.goals as string[]) ?? [],
      sessionCount: 14,
      memories: memories.map((m) => m.statement),
      language: (s.language as string) ?? "en",
      culture: (s.culture as UserProfile["culture"]) ?? {
        primaryLanguage: ((s.language as string) ?? "en"),
        countryOfResidence: (s.country as string) ?? undefined,
      },
      activeModes: [],
    });
    refreshQuota();
  }, []);

  const refreshQuota = async () => {
    try {
      const res = await fetch("/api/voice/quota");
      const data = await res.json();
      if (res.ok) setQuota(data);
    } catch {}
  };

  const minLeftWeek = quota ? Math.floor(quota.weeklyRemainingSec / 60) : 0;
  const minUsedWeek = quota ? Math.floor(quota.weeklyUsedSec / 60) : 0;
  const minLimitWeek = quota ? Math.floor(quota.weeklyLimitSec / 60) : 0;

  const isFree = quota?.plan === "free";
  const dryWeek = quota && !isFree && quota.weeklyRemainingSec <= 0;

  return (
    <div className="voice-page">
      <header className="voice-header">
        <div>
          <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Voice</p>
          <h2 style={{ marginTop: 6 }}>Talk it out.</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-70)", marginTop: 8, maxWidth: 540 }}>
            For the moments typing is too much. Aura listens, reflects, and responds. Sessions cap
            at 20 minutes each — short and useful is the point.
          </p>
        </div>

        {quota && !isFree && (
          <div className="voice-quota-card">
            <p className="body-micro" style={{ color: "var(--calm-ink-40)" }}>Voice this week</p>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, lineHeight: 1, marginTop: 4 }}>
              {minLeftWeek} <span style={{ fontSize: 14, color: "var(--calm-ink-40)" }}>min left</span>
            </p>
            <div className="voice-bar">
              <div
                className="voice-bar-fill"
                style={{ width: `${Math.min(100, (minUsedWeek / Math.max(1, minLimitWeek)) * 100)}%` }}
              />
            </div>
            <p style={{ fontSize: 12, color: "var(--calm-ink-40)", marginTop: 6 }}>
              {minUsedWeek} of {minLimitWeek} min · resets Monday
            </p>
          </div>
        )}
      </header>

      {isFree && (
        <FreeBlock onUpgrade={() => setShowUpgrade(true)} />
      )}

      {!isFree && dryWeek && (
        <OutOfMinutes onTopup={async () => {
          const ok = window.confirm("Top-up: $12 → 30 more minutes this week, 50 more this month. Continue?");
          if (!ok) return;
          const res = await fetch("/api/voice/topup", { method: "POST" });
          const data = await res.json();
          if (res.ok) {
            setQuota({ plan: "pro", ...data.quota });
          } else {
            window.alert(data.error ?? "Could not apply top-up.");
          }
        }} />
      )}

      {!isFree && !dryWeek && quota && (
        <VoiceAgent
          profile={profile}
          onSessionEnd={(transcript) => {
            // Approximate: 6 seconds per agent message; this is replaced by real
            // voice-pipeline timing once we own the pipeline.
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
          padding: 32px;
          max-width: 880px;
          margin: 0 auto;
        }
        .voice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .voice-quota-card {
          min-width: 200px;
          background: var(--calm-mist);
          border-radius: 12px;
          padding: 16px 20px;
        }
        .voice-bar {
          margin-top: 10px;
          height: 4px;
          background: var(--calm-ink-10);
          border-radius: 999px;
          overflow: hidden;
        }
        .voice-bar-fill {
          height: 100%;
          background: var(--calm-forest);
          transition: width 0.4s ease;
        }
      `}</Style>
    </div>
  );
}

function FreeBlock({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div
      style={{
        background: "var(--calm-mist)",
        border: "1px solid var(--calm-forest-20)",
        borderLeft: "3px solid var(--calm-forest)",
        borderRadius: 14,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Voice is part of keeping your space open</p>
      <h3>Voice unlocks when you upgrade.</h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>
        Voice costs more to run than text, so it sits behind the paid plan. 20 minutes a week
        included, more on demand if you ever need it.
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
        background: "var(--calm-white)",
        border: "1px solid var(--calm-ink-10)",
        borderRadius: 14,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p className="body-micro" style={{ color: "var(--calm-forest)" }}>You&apos;ve used your voice minutes for this week</p>
      <h3>We&apos;ve talked a lot. Let&apos;s rest the voice for a bit.</h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>
        Voice resets Monday. Until then text is open and waiting. If you need voice now, a one-time
        top-up of $12 adds 30 more minutes this week and 50 more for the month.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={onTopup} className="btn-primary">Top up · $12</button>
        <a href="/dashboard/session" className="btn-ghost">Switch to text</a>
      </div>
    </div>
  );
}
