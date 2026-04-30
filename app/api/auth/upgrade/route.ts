import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, signSession, buildSessionCookie, cookieDomainFor, isAdminEmail } from "@/lib/auth";
import { getUserById, setUserPlan } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const claims = await verifySession(token);
  if (!claims) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: { plan?: "free" | "pro" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const plan = body.plan === "pro" ? "pro" : "free";

  const user = getUserById(claims.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const updated = setUserPlan(user.id, plan)!;
  const newToken = await signSession({
    sub: updated.id,
    email: updated.email,
    name: updated.name,
    plan: updated.plan,
    isAdmin: isAdminEmail(updated.email),
  });
  const host = req.headers.get("host");
  const cookie = buildSessionCookie(newToken, {
    domain: cookieDomainFor(host),
    secure: process.env.NODE_ENV === "production",
  });

  return new NextResponse(JSON.stringify({ user: { email: updated.email, name: updated.name, plan: updated.plan } }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
    },
  });
}
