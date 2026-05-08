import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { recordVoiceMinutes, getVoiceQuotaSnapshot } from "@/lib/voice-quota";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  let body: { minutes?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const minutes = Number(body.minutes);
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 60) {
    return NextResponse.json({ error: "Bad minute count" }, { status: 400 });
  }

  await recordVoiceMinutes(claims.sub, minutes);
  const snap = await getVoiceQuotaSnapshot(claims.sub, claims.plan);
  return NextResponse.json({ ok: true, quota: { plan: claims.plan, ...snap } });
}
