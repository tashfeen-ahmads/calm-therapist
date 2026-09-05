import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, clearSessionCookie, cookieDomainFor } from "@/lib/auth";
import { dbEnabled, prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/users";

export const runtime = "nodejs";

/**
 * Deletes the signed-in member and everything attached to them. Cascades in
 * the schema remove sessions, memories, goals, journal, feedback, queued
 * emails, and voice records. Crisis events and usage events keep their rows
 * with the user reference cleared (audit trail), as the privacy page says.
 */
export async function DELETE(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  const user = await getUserById(claims.sub);
  if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  if (user.isAdmin) return NextResponse.json({ error: "Admin accounts cannot self-delete." }, { status: 403 });

  if (dbEnabled) {
    await prisma.user.delete({ where: { id: user.id } });
  } else {
    const g = globalThis as unknown as { __calmUsers?: Map<string, unknown> };
    g.__calmUsers?.delete(user.email);
  }

  const cookie = clearSessionCookie({
    domain: cookieDomainFor(req.headers.get("host")),
    secure: process.env.NODE_ENV === "production",
  });
  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
  });
}
