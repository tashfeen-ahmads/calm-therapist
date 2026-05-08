import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { applyTopup, getVoiceQuotaSnapshot, VOICE_TOPUP } from "@/lib/voice-quota";
import { scheduleEmail } from "@/lib/email-queue";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

/**
 * MVP top-up. In production this will create a Stripe payment intent and only
 * apply the bonus after webhook confirmation. For now it just applies the
 * bonus and returns the new snapshot — Stripe is plug-in-able later.
 */
export async function POST() {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (claims.plan !== "pro") {
    return NextResponse.json(
      { error: "Top-ups are for Pro accounts. Open your space first." },
      { status: 403 }
    );
  }
  const result = applyTopup(claims.sub);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const snap = getVoiceQuotaSnapshot(claims.sub, claims.plan);

  // Receipt email goes out immediately.
  scheduleEmail({
    userId: claims.sub,
    to: claims.email,
    templateKey: "topup-receipt",
    ctx: { name: claims.name, email: claims.email, appUrl: APP_URL, topupAmountUsd: VOICE_TOPUP.priceUsd },
  });

  return NextResponse.json({
    ok: true,
    pack: VOICE_TOPUP,
    quota: snap,
  });
}

export async function GET() {
  return NextResponse.json({ pack: VOICE_TOPUP });
}
