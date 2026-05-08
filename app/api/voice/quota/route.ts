import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { getVoiceQuotaSnapshot } from "@/lib/voice-quota";

export const runtime = "nodejs";

export async function GET() {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  const snap = await getVoiceQuotaSnapshot(claims.sub, claims.plan);
  return NextResponse.json({ plan: claims.plan, ...snap });
}
