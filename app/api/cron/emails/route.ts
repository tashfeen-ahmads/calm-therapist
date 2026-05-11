import { NextResponse } from "next/server";
import { processDueEmails } from "@/lib/email-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron-callable processor. Runs through the queue, sends anything that's
 * due, and returns a summary. Protect with CRON_SECRET in production.
 *
 * Vercel Cron config (vercel.json):
 *   {
 *     "crons": [{ "path": "/api/cron/emails", "schedule": "*\/5 * * * *" }]
 *   }
 *
 * Or any external scheduler (cron-job.org / Upstash QStash) hitting this
 * endpoint with the secret header.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". Also accept
    // x-cron-secret and ?secret= for external schedulers.
    const auth = req.headers.get("authorization") ?? "";
    const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : null;
    const provided =
      bearer ??
      req.headers.get("x-cron-secret") ??
      new URL(req.url).searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  const result = await processDueEmails();
  return NextResponse.json({ ok: true, ...result });
}

// Allow GET as well for one-off browser triggering when secret matches.
export async function GET(req: Request) {
  return POST(req);
}
