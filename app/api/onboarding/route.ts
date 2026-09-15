import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { rateLimit, identifierFor } from "@/lib/rate-limit";
import { generateOnboardingReflection, llmConfigured, UserProfile, DEFAULT_PROFILE } from "@/lib/aura";

export const runtime = "nodejs";

/**
 * The closing reflection at the end of onboarding.
 *
 * This calls the language model, which costs money per request, so it is
 * gated twice. It was previously open: no session required and no limit, so
 * anyone who found the path could loop it and spend the OpenAI budget on our
 * behalf until the card declined. Onboarding always happens after signup, so
 * requiring a session costs a real member nothing.
 */
export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const limit = rateLimit(claims.sub, { bucket: "onboarding-reflect", windowSec: 60 * 60, max: 10 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "That is enough for now. Try again shortly." }, { status: 429 });
  }

  let data: Record<string, unknown>;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

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

  if (!llmConfigured()) {
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
  return `So, ${profile.name}. What brings you here is ${focus || "something worth taking seriously"}. Calm AI Therapy will hold what you share, and build on every session. We can start whenever you're ready.`;
}
