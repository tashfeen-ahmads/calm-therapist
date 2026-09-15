"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, readState, writeState } from "@/components/onboarding/OnboardingShell";

const TONES = [
  { key: "warm", label: "Warm", line: "Gentle. Stays with the feeling before anything else." },
  { key: "direct", label: "Direct", line: "Plain. Says the thing, kindly, without circling it." },
  { key: "clinical", label: "Measured", line: "Calm and structured. Less warmth, more clarity." },
];

/**
 * How open is this subject where they live?
 *
 * This replaces two free-text boxes and a country-code field. The old version
 * asked people to describe their own cultural context in prose and then type
 * "PK" or "AE" from memory, which is a lot to ask of someone who arrived
 * because they were struggling. Three taps carry the same signal, and more
 * honestly: what matters to Aura is not which country it is, it is whether
 * this person can talk about it with anyone around them.
 */
const OPENNESS = [
  { key: "low", label: "It's normal to talk about this", line: "People around me would understand." },
  { key: "moderate", label: "It's not really discussed", line: "I'd be careful who I told." },
  { key: "high", label: "It would cause real trouble", line: "Nobody around me can know." },
];

const WANTS = [
  { key: "listen", label: "Just listen", line: "I need to get it out." },
  { key: "think", label: "Help me think", line: "I want to understand it better." },
  { key: "practical", label: "Help me decide", line: "There's something I have to do." },
];

export default function Step3Page() {
  const router = useRouter();
  const [tone, setTone] = useState("warm");
  const [openness, setOpenness] = useState("moderate");
  const [want, setWant] = useState("listen");

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    if (typeof s.tone === "string") setTone(s.tone);
    if (typeof s.stigmaContext === "string") setOpenness(s.stigmaContext);
    if (typeof s.wantsFirst === "string") setWant(s.wantsFirst);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    writeState({ tone, stigmaContext: openness, wantsFirst: want });
    router.push("/onboarding/step-5");
  };

  return (
    <OnboardingShell step={3}>
      <h2 style={{ marginBottom: 16 }}>How should Aura be with you?</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Three taps and you are in. None of it is fixed; tell her to change and she will.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <CardGroup label="Her tone" options={TONES} value={tone} onChange={setTone} />
        <CardGroup
          label="Talking about this where you are"
          options={OPENNESS}
          value={openness}
          onChange={setOpenness}
        />
        <CardGroup label="Right now, you mostly want her to" options={WANTS} value={want} onChange={setWant} />

        <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
          Continue
        </button>
      </form>
    </OnboardingShell>
  );
}

function CardGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: string; label: string; line: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="body-micro" style={{ color: "var(--calm-ink-40)", marginBottom: 12 }}>
        {label}
      </legend>
      <div className="onboard-cards">
        {options.map((o) => {
          const on = value === o.key;
          return (
            <button
              type="button"
              key={o.key}
              onClick={() => onChange(o.key)}
              aria-pressed={on}
              style={{
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: 12,
                cursor: "pointer",
                background: on ? "var(--calm-forest-10)" : "var(--calm-white)",
                border: "1px solid " + (on ? "var(--calm-forest)" : "var(--calm-ink-10)"),
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ display: "block", fontSize: 15, fontWeight: 500, color: "var(--calm-ink)" }}>
                {o.label}
              </span>
              <span style={{ display: "block", fontSize: 13, color: "var(--calm-ink-40)", marginTop: 4, lineHeight: 1.5 }}>
                {o.line}
              </span>
            </button>
          );
        })}
      </div>
      <style>{`
        .onboard-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 620px) { .onboard-cards { grid-template-columns: 1fr; } }
      `}</style>
    </fieldset>
  );
}
