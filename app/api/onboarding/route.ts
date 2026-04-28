import { NextResponse } from "next/server";
import { generateOnboardingReflection, UserProfile, DEFAULT_PROFILE } from "@/lib/claude";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const data = (await req.json()) as Record<string, unknown>;

  const profile: UserProfile = {
    ...DEFAULT_PROFILE,
    name: typeof data.name === "string" && data.name ? data.name : "friend",
    age: typeof data.age === "string" ? data.age : undefined,
    tone:
      data.tone === "direct" || data.tone === "clinical" || data.tone === "warm"
        ? (data.tone as UserProfile["tone"])
        : "warm",
    focusAreas: Array.isArray(data.focusAreas) ? (data.focusAreas as string[]) : [],
    currentGoals: Array.isArray(data.goals) ? (data.goals as string[]) : [],
    language: typeof data.language === "string" ? data.language : "en",
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      reflection: fallback(profile),
    });
  }

  try {
    const reflection = await generateOnboardingReflection(profile);
    return NextResponse.json({ reflection });
  } catch (err) {
    console.error("Onboarding reflection error", err);
    return NextResponse.json({ reflection: fallback(profile) });
  }
}

function fallback(profile: UserProfile) {
  const focus = profile.focusAreas.slice(0, 2).join(" and ").toLowerCase();
  return `So, ${profile.name} — what brings you here is ${focus || "something worth taking seriously"}. Calm Therapist will hold what you share, and build on every session. We can start whenever you're ready.`;
}
