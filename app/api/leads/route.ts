import { NextResponse } from "next/server";
import { captureLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  const source = (body.source ?? "landing-popup").trim();
  const lead = await captureLead(email, source);
  return NextResponse.json({ ok: true, leadId: lead.id });
}
