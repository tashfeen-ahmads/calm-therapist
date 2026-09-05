"use client";

import { useEffect, useState } from "react";
import { readState } from "@/components/onboarding/OnboardingShell";
import { DEFAULT_PROFILE, type UserProfile } from "@/lib/claude";
import { loadMemories } from "@/lib/memory";
import { cultureFromFields } from "@/lib/profile-input";

interface ServerProfile {
  profile: {
    name: string;
    age?: string;
    tone: "warm" | "direct" | "clinical";
    language: string;
    focusAreas: string[];
    goals: string[];
    culturalContext?: string;
    familySystem?: string;
    countryOfResidence?: string;
    diasporaStatus?: string;
    stigmaContext?: string;
    somaticExpression?: string;
  };
  memories: { statement: string }[];
  sessionCount: number;
}

/**
 * The profile Aura uses on this device. Starts from local onboarding state
 * so the page renders immediately, then replaces it with the server record
 * so a second device sees the same person and the same memories.
 */
export function useServerProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [memoryCount, setMemoryCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    const local = loadMemories();
    setMemoryCount(local.length);
    setProfile({
      name: (s.name as string) || "friend",
      age: (s.age as string) || undefined,
      tone: s.tone === "direct" || s.tone === "clinical" ? (s.tone as UserProfile["tone"]) : "warm",
      focusAreas: (s.focusAreas as string[]) ?? [],
      currentGoals: (s.goals as string[]) ?? [],
      sessionCount: 1,
      memories: local.map((m) => m.statement),
      language: (s.language as string) ?? "en",
      culture: cultureFromFields({
        language: (s.language as string) ?? "en",
        countryOfResidence: (s.country as string) ?? undefined,
        culturalContext: s.culturalContext as string | undefined,
        stigmaContext: s.stigmaContext as string | undefined,
        somaticExpression: s.somaticExpression as string | undefined,
      }),
      activeModes: [],
    });

    let cancelled = false;
    fetch("/api/users/me/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ServerProfile | null) => {
        if (cancelled || !d?.profile) return;
        const p = d.profile;
        setMemoryCount(d.memories.length);
        setProfile({
          name: p.name || "friend",
          age: p.age,
          tone: p.tone,
          focusAreas: p.focusAreas,
          currentGoals: p.goals,
          sessionCount: d.sessionCount,
          memories: d.memories.map((m) => m.statement),
          language: p.language,
          culture: cultureFromFields(p),
          activeModes: [],
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, memoryCount, ready };
}
