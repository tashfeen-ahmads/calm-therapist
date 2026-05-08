import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { scheduleEmail, cancelPendingFor } from "@/lib/email-queue";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

type Event =
  | { kind: "session-ended"; reflection?: string }
  | { kind: "crisis-flagged"; tier: number }
  | { kind: "topup-completed"; amountUsd: number }
  | { kind: "user-active" };

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

  switch (body.kind) {
    case "session-ended": {
      // Send a "thinking about you" follow-up an hour later.
      scheduleEmail({
        userId: claims.sub,
        to: claims.email,
        templateKey: "after-first",
        ctx: { ...ctx, reflection: body.reflection },
      });
      // The user is active — push back the inactivity ladder.
      cancelPendingFor(claims.sub, "inactive-3d");
      cancelPendingFor(claims.sub, "inactive-7d");
      cancelPendingFor(claims.sub, "inactive-30d");
      scheduleEmail({ userId: claims.sub, to: claims.email, templateKey: "inactive-3d", ctx, replaceExisting: true });
      scheduleEmail({ userId: claims.sub, to: claims.email, templateKey: "inactive-7d", ctx, replaceExisting: true });
      scheduleEmail({ userId: claims.sub, to: claims.email, templateKey: "inactive-30d", ctx, replaceExisting: true });
      break;
    }
    case "crisis-flagged": {
      if (body.tier >= 2) {
        scheduleEmail({ userId: claims.sub, to: claims.email, templateKey: "crisis-followup-24h", ctx });
      }
      break;
    }
    case "topup-completed": {
      scheduleEmail({
        userId: claims.sub,
        to: claims.email,
        templateKey: "topup-receipt",
        ctx: { ...ctx, topupAmountUsd: body.amountUsd },
      });
      break;
    }
    case "user-active": {
      // Quietly cancel inactivity emails — user came back.
      cancelPendingFor(claims.sub, "inactive-3d");
      cancelPendingFor(claims.sub, "inactive-7d");
      cancelPendingFor(claims.sub, "inactive-30d");
      break;
    }
  }

  return NextResponse.json({ ok: true });
}
