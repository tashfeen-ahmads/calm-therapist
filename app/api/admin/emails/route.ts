import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { listQueue, processDueEmails, summariseQueue } from "@/lib/email-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const [summary, items] = await Promise.all([summariseQueue(), listQueue()]);
  return NextResponse.json({ summary, items: items.slice(-200) });
}

export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const url = new URL(req.url);
  if (url.searchParams.get("action") === "run") {
    const r = await processDueEmails();
    return NextResponse.json({ ok: true, ...r });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
