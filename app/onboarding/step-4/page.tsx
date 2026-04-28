"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, readState, writeState } from "@/components/onboarding/OnboardingShell";

const FREQUENCIES = ["Daily", "3x week", "Weekly"];

const PLACEHOLDERS = [
  "e.g. Have one conversation without anxiety",
  "e.g. Sleep before midnight three times",
  "e.g. Tell someone how I actually feel",
];

export default function Step4Page() {
  const router = useRouter();
  const [goals, setGoals] = useState<string[]>(["", "", ""]);
  const [frequency, setFrequency] = useState("3x week");

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    if (Array.isArray(s.goals)) {
      const stored = s.goals as string[];
      setGoals([stored[0] ?? "", stored[1] ?? "", stored[2] ?? ""]);
    }
    if (typeof s.frequency === "string") setFrequency(s.frequency);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    writeState({ goals: goals.filter((g) => g.trim()), frequency });
    router.push("/onboarding/step-5");
  };

  return (
    <OnboardingShell step={4}>
      <h2 style={{ marginBottom: 16 }}>What would progress look like for you?</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Three small things you&apos;d like to be true a month from now. Not goals to chase. Just
        things to notice.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {goals.map((g, i) => (
          <input
            key={i}
            className="input"
            placeholder={PLACEHOLDERS[i]}
            value={g}
            onChange={(e) =>
              setGoals((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))
            }
          />
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
            How often do you want to check in?
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {FREQUENCIES.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFrequency(f)}
                className={`pill ${frequency === f ? "active" : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: 16 }}>
          Continue
        </button>
      </form>
    </OnboardingShell>
  );
}
