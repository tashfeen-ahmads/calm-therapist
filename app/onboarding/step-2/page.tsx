"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, readState, writeState } from "@/components/onboarding/OnboardingShell";

const FOCUS_OPTIONS = [
  "Work",
  "Relationships",
  "Family",
  "Sleep",
  "Overthinking",
  "Low energy",
  "Direction",
  "Self-talk",
  "Loneliness",
  "Loss",
  "Anger",
  "Who I am",
];

export default function Step2Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    if (Array.isArray(s.focusAreas)) setSelected(s.focusAreas as string[]);
  }, []);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : prev.length < 3
        ? [...prev, item]
        : prev
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    writeState({ focusAreas: selected });
    router.push("/onboarding/step-3");
  };

  return (
    <OnboardingShell step={2}>
      <h2 style={{ marginBottom: 16 }}>What do you want to think more clearly about?</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Pick up to three, or skip it. You can change them later, and Aura works it out from
        what you say anyway.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {FOCUS_OPTIONS.map((option) => {
            const isActive = selected.includes(option);
            return (
              <button
                type="button"
                key={option}
                onClick={() => toggle(option)}
                className={`pill ${isActive ? "active" : ""}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
          {selected.length ? "Continue" : "Skip this"}
        </button>
      </form>
    </OnboardingShell>
  );
}
