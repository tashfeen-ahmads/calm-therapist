import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { buildSessionCookie, cookieDomainFor, isAdminEmail, signSession } from "@/lib/auth";
import { scheduleEmail } from "@/lib/email-queue";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

export async function POST(req: Request) {
  let body: { email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  const name = (body.name ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password needs at least 8 characters." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Tell us what to call you." }, { status: 400 });
  }

  try {
    const user = await createUser({ email, password, name });
    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      isAdmin: isAdminEmail(user.email),
    });

    // Schedule the welcome sequence. The same scheduler runs on session ends
    // and inactivity ticks elsewhere — here we set the first three touches.
    const ctx = { name: user.name, email: user.email, appUrl: APP_URL };
    scheduleEmail({ userId: user.id, to: user.email, templateKey: "welcome", ctx });
    scheduleEmail({ userId: user.id, to: user.email, templateKey: "day-2", ctx });
    scheduleEmail({ userId: user.id, to: user.email, templateKey: "day-7", ctx });

    const host = req.headers.get("host");
    const cookie = buildSessionCookie(token, {
      domain: cookieDomainFor(host),
      secure: process.env.NODE_ENV === "production",
    });

    return new NextResponse(
      JSON.stringify({ user: { email: user.email, name: user.name, plan: user.plan } }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (err) {
    if ((err as Error).message === "EMAIL_TAKEN") {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }
    console.error("signup error", err);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
