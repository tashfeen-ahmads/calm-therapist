import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { getProfile, listMemories, sanitizeProfilePatch, saveProfile, sessionCount } from "@/lib/profiles";
import { setEmailOptOut } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The member's profile, memories, and session count, for hydrating any device. */
export async function GET() {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  const [profile, memories, sessions] = await Promise.all([
    getProfile(claims.sub),
    listMemories(claims.sub),
    sessionCount(claims.sub),
  ]);
  if (!profile) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  return NextResponse.json({ profile, memories, sessionCount: sessions });
}

/** Saves a validated patch of the profile. Unknown keys are ignored. */
export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object") throw new Error("bad");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const patch = sanitizeProfilePatch(body);
  if (typeof patch.emailOptOut === "boolean") await setEmailOptOut(claims.sub, patch.emailOptOut);
  await saveProfile(claims.sub, patch);
  return NextResponse.json({ ok: true, persisted: true });
}
