"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, readState, writeState } from "@/components/onboarding/OnboardingShell";

const TONES = [
  { key: "warm", title: "Warm and gentle", desc: "Like a friend who has all the time in the world." },
  { key: "direct", title: "Direct and clear", desc: "No soft-pedalling. Tell me what I need to hear." },
  { key: "clinical", title: "Clinical and structured", desc: "Evidence-based, methodical, and precise." },
];

const MODES = ["Voice", "Chat", "I'm not sure yet"];

const CULTURAL_CONTEXTS = [
  { key: "communal", title: "Communal", desc: "Family and community shape my decisions." },
  { key: "individualist", title: "Individualist", desc: "I largely chart my own path." },
  { key: "mixed-diaspora", title: "Mixed / diaspora", desc: "I move between two cultural worlds." },
];

const STIGMA = [
  { key: "high", label: "High — talking about this is risky around me" },
  { key: "moderate", label: "Moderate" },
  { key: "low", label: "Low — open conversation is fine" },
];

export default function Step3Page() {
  const router = useRouter();
  const [tone, setTone] = useState<string>("warm");
  const [mode, setMode] = useState<string>("I'm not sure yet");
  const [culturalContext, setCulturalContext] = useState<string>("");
  const [stigmaContext, setStigmaContext] = useState<string>("moderate");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    const s = readState() as Record<string, string>;
    if (s.tone) setTone(s.tone);
    if (s.startingMode) setMode(s.startingMode);
    if (s.culturalContext) setCulturalContext(s.culturalContext);
    if (s.stigmaContext) setStigmaContext(s.stigmaContext);
    if (s.country) setCountry(s.country);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    writeState({ tone, startingMode: mode, culturalContext, stigmaContext, country });
    // Skip the goals step in onboarding — users can add goals from the
    // dashboard once they've felt the value of the first conversation.
    router.push("/onboarding/step-5");
  };

  return (
    <OnboardingShell step={3}>
      <h2 style={{ marginBottom: 16 }}>Choose your tone.</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Calm Therapist adapts to how you want to be spoken to.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TONES.map((t) => {
            const active = tone === t.key;
            return (
              <button
                type="button"
                key={t.key}
                onClick={() => setTone(t.key)}
                style={{
                  textAlign: "left",
                  background: active ? "var(--calm-forest)" : "var(--calm-white)",
                  color: active ? "white" : "var(--calm-ink)",
                  border: active ? "1px solid var(--calm-forest)" : "1px solid var(--calm-ink-10)",
                  borderRadius: 12,
                  padding: 28,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 500 }}>
                  {t.title}
                </span>
                <span style={{ fontSize: 14, opacity: active ? 0.85 : 0.6 }}>{t.desc}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
            How do you want to start?
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MODES.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMode(m)}
                className={`pill ${mode === m ? "active" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
            How does your world work?
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CULTURAL_CONTEXTS.map((c) => (
              <button
                type="button"
                key={c.key}
                onClick={() => setCulturalContext(c.key)}
                className={`pill ${culturalContext === c.key ? "active" : ""}`}
                title={c.desc}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
            Mental-health stigma in your environment?
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {STIGMA.map((s) => (
              <label
                key={s.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  border: "1px solid var(--calm-ink-10)",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: stigmaContext === s.key ? "var(--calm-forest-10)" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="stigma"
                  value={s.key}
                  checked={stigmaContext === s.key}
                  onChange={() => setStigmaContext(s.key)}
                />
                <span style={{ fontSize: 14 }}>{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>Country (so we route the right crisis line if needed)</span>
          <input
            className="input"
            placeholder="e.g. PK, US, UK, IN, AE…"
            value={country}
            onChange={(e) => setCountry(e.target.value.toUpperCase())}
            maxLength={3}
          />
        </label>

        <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
          Continue
        </button>
      </form>
    </OnboardingShell>
  );
}
