import type { CulturalProfile, UserProfile } from "./aura";

/**
 * Caps and cleans profile fields that come from the client before they are
 * interpolated into Aura's prompt. Nothing from here can add headings or
 * instructions: line breaks and markdown heading markers are removed and
 * every string is length-limited.
 */

const MAX = {
  name: 40,
  age: 12,
  language: 24,
  focusArea: 60,
  goal: 160,
  memory: 240,
  cultureField: 80,
};

function clean(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.replace(/[\r\n\t]+/g, " ").replace(/^[#>*\-\s]+/, "").trim();
  if (!s) return undefined;
  return s.slice(0, max);
}

function cleanList(v: unknown, max: number, count: number): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => clean(x, max))
    .filter((x): x is string => !!x)
    .slice(0, count);
}

export function sanitizeProfile(p: Partial<UserProfile> & { name?: string }): UserProfile {
  const tone = p.tone === "direct" || p.tone === "clinical" ? p.tone : "warm";
  const cultureIn = (p.culture ?? {}) as Record<string, unknown>;
  const culture = p.culture
    ? {
        primaryLanguage: clean(cultureIn.primaryLanguage, MAX.cultureField),
        countryOfResidence: clean(cultureIn.countryOfResidence, 3)?.toUpperCase(),
        culturalContext: clean(cultureIn.culturalContext, MAX.cultureField),
        familySystem: clean(cultureIn.familySystem, MAX.cultureField),
        diasporaStatus: clean(cultureIn.diasporaStatus, MAX.cultureField),
        stigmaContext: clean(cultureIn.stigmaContext, MAX.cultureField),
        somaticExpression: clean(cultureIn.somaticExpression, MAX.cultureField),
      }
    : undefined;
  return {
    name: clean(p.name, MAX.name) ?? "friend",
    age: clean(p.age, MAX.age),
    tone,
    focusAreas: cleanList(p.focusAreas, MAX.focusArea, 8),
    currentGoals: cleanList(p.currentGoals, MAX.goal, 6),
    memories: cleanList(p.memories, MAX.memory, 20),
    sessionCount: typeof p.sessionCount === "number" && p.sessionCount > 0 ? Math.min(p.sessionCount, 9999) : 1,
    language: clean(p.language, MAX.language) ?? "en",
    culture: culture as UserProfile["culture"],
    activeModes: Array.isArray(p.activeModes) ? (p.activeModes ?? []).slice(0, 2) : [],
  };
}

/** Builds a typed CulturalProfile from loosely stored strings, dropping unknown values. */
export function cultureFromFields(f: {
  language?: string;
  countryOfResidence?: string;
  culturalContext?: string;
  familySystem?: string;
  diasporaStatus?: string;
  stigmaContext?: string;
  somaticExpression?: string;
}): CulturalProfile {
  const pick = <T extends string>(v: string | undefined, allowed: readonly T[]): T | undefined =>
    v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
  return {
    primaryLanguage: f.language ?? "en",
    countryOfResidence: f.countryOfResidence,
    culturalContext: pick(f.culturalContext, ["individualist", "communal", "mixed-diaspora"] as const),
    familySystem: pick(f.familySystem, ["nuclear", "extended-active", "extended-distant"] as const),
    diasporaStatus: pick(f.diasporaStatus, ["yes", "no"] as const),
    stigmaContext: pick(f.stigmaContext, ["high", "moderate", "low"] as const),
    somaticExpression: pick(f.somaticExpression, ["yes", "no", "unknown"] as const),
  };
}
