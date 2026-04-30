import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/users";
import { buildSessionCookie, cookieDomainFor, isAdminEmail, signSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "That email and password don't match anything." },
      { status: 401 }
    );
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    isAdmin: isAdminEmail(user.email),
  });
  const host = req.headers.get("host");
  const cookie = buildSessionCookie(token, {
    domain: cookieDomainFor(host),
    secure: process.env.NODE_ENV === "production",
  });

  return new NextResponse(
    JSON.stringify({ user: { email: user.email, name: user.name, plan: user.plan } }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    }
  );
}
