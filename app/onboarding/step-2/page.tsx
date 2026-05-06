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
  const [note, setNote] = useState("");

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    if (Array.isArray(s.focusAreas)) setSelected(s.focusAreas as string[]);
    if (typeof s.contextNote === "string") setNote(s.contextNote);
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
    writeState({ focusAreas: selected, contextNote: note.trim() });
    router.push("/onboarding/step-3");
  };

  return (
    <OnboardingShell step={2}>
      <h2 style={{ marginBottom: 16 }}>What do you want to think more clearly about?</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Pick up to three. You can change these later. Aura will use them to shape your first
        conversation.
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

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
            Anything else you want Calm Therapist to know?
          </span>
          <textarea
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="You don't have to explain it perfectly. Just write."
            rows={5}
          />
        </label>

        <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
          Continue
        </button>
      </form>
    </OnboardingShell>
  );
}
