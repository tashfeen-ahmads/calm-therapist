"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ShellProps {
  step: 1 | 2 | 3 | 4 | 5;
  children: ReactNode;
}

// Three-stage journey for the user even though there are five page slots.
// Steps 4 and 5 collapse into "almost there" so the user feels close to
// actually talking to Aura.
const DISPLAY_STAGE: Record<1 | 2 | 3 | 4 | 5, { stage: number }> = {
  1: { stage: 1 },
  2: { stage: 2 },
  3: { stage: 3 },
  4: { stage: 3 },
  5: { stage: 3 },
};

export function OnboardingShell({ step, children }: ShellProps) {
  const stage = DISPLAY_STAGE[step].stage;
  const pct = (stage / 3) * 100;
  // Step 5 reaches back to step 3 because we skip step 4 (goals).
  const prev =
    step === 5 ? "/onboarding/step-3" : step > 1 ? `/onboarding/step-${step - 1}` : null;
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div
        style={{
          height: 3,
          background: "var(--calm-ink-10)",
          borderRadius: 999,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "var(--calm-forest)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 48,
          fontSize: 12,
          color: "var(--calm-ink-40)",
        }}
      >
        <span className="body-micro">Step {stage} of 3</span>
        {prev ? (
          <Link href={prev} style={{ color: "var(--calm-ink-40)", fontSize: 13 }}>
            ← Back
          </Link>
        ) : (
          <span />
        )}
      </div>

      {children}
    </div>
  );
}

export function OnboardingState() {
  // helpers exposed elsewhere
  return null;
}

export const ONBOARDING_KEY = "calm-therapist:onboarding";

export function readState(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeState(patch: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const current = readState();
  window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify({ ...current, ...patch }));
}
