import { NextResponse } from "next/server";
import { VOICE_TOPUP } from "@/lib/voice-quota";

export const runtime = "nodejs";

/**
 * Top-ups are not sold during the free period. When paid plans switch on,
 * they are credited only by the Stripe webhook after payment.
 */
export async function POST() {
  return NextResponse.json({ error: "Top-ups are not available yet." }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ pack: VOICE_TOPUP, available: false });
}
