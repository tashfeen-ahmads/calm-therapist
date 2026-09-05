import { BRAND } from "@/lib/brand";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { scheduleEmail, cancelPendingFor } from "@/lib/email-queue";

export const runtime = "nodejs";

const APP_URL = BRAND.url;

/**
 * Lifecycle signals from the app. Carries no conversation content: the
 * after-first email is sent once per member, the crisis follow-up is
 * de-duplicated, and receipts are only ever created by the payment webhook.
 */
type Event = { kind: "session-ended" } | { kind: "crisis-flagged"; tier: number } | { kind: "user-active" };

export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ ok: true });

  let body: Event;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ctx = { name: claims.name, email: claims.email, appUrl: APP_URL };
  const base = { userId: claims.sub, to: claims.email, ctx };

  switch (body.kind) {
    case "session-ended": {
      await scheduleEmail({ ...base, templateKey: "after-first", once: true });
      await scheduleEmail({ ...base, templateKey: "inactive-3d", replaceExisting: true });
      await scheduleEmail({ ...base, templateKey: "inactive-7d", replaceExisting: true });
      await scheduleEmail({ ...base, templateKey: "inactive-30d", replaceExisting: true });
      break;
    }
    case "crisis-flagged": {
      if (Number(body.tier) >= 2) {
        await scheduleEmail({ ...base, templateKey: "crisis-followup-24h", replaceExisting: true });
      }
      break;
    }
    case "user-active": {
      await cancelPendingFor(claims.sub, "inactive-3d");
      await cancelPendingFor(claims.sub, "inactive-7d");
      await cancelPendingFor(claims.sub, "inactive-30d");
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
