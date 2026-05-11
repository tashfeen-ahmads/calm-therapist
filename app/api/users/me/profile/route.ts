import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { dbEnabled, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Persist the onboarding state to the authenticated user's row.
 *
 * Called at the end of onboarding (step 5 "Meet your agent") — until now
 * everything was localStorage-only, which meant a logged-in user's profile
 * didn't survive a fresh browser. Now Aura's cultural + tone + focus
 * context is durable across devices.
 *
 * In memory-mode (no DATABASE_URL) this no-ops gracefully; localStorage is
 * still the source of truth on that machine.
 */
interface ProfilePayload {
  name?: string;
  age?: string;
  tone?: string;
  language?: string;
  focusAreas?: string[];
  culturalContext?: string;
  familySystem?: string;
  countryOfResidence?: string;
  diasporaStatus?: string;
  stigmaContext?: string;
  somaticExpression?: string;
}

const ALLOWED_TONES = new Set(["warm", "direct", "clinical"]);

export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  let body: ProfilePayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!dbEnabled) {
    // Memory mode: localStorage holds it. Nothing to persist here.
    return NextResponse.json({ ok: true, persisted: false });
  }

  await prisma.user.update({
    where: { id: claims.sub },
    data: {
      ...(body.name ? { name: body.name.trim() } : {}),
      ...(body.age ? { ageGroup: body.age } : {}),
      ...(body.tone && ALLOWED_TONES.has(body.tone) ? { tone: body.tone } : {}),
      ...(body.language ? { language: body.language } : {}),
      ...(Array.isArray(body.focusAreas) ? { focusAreas: body.focusAreas } : {}),
      ...(body.culturalContext ? { culturalContext: body.culturalContext } : {}),
      ...(body.familySystem ? { familySystem: body.familySystem } : {}),
      ...(body.countryOfResidence ? { countryOfResidence: body.countryOfResidence } : {}),
      ...(body.diasporaStatus ? { diasporaStatus: body.diasporaStatus } : {}),
      ...(body.stigmaContext ? { stigmaContext: body.stigmaContext } : {}),
      ...(body.somaticExpression ? { somaticExpression: body.somaticExpression } : {}),
    },
  });

  return NextResponse.json({ ok: true, persisted: true });
}
