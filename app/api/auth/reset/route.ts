import { NextResponse } from "next/server";
import { consumeResetToken } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const token = (body.token ?? "").trim();
  const password = body.password ?? "";
  if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ error: "Password needs at least 8 characters." }, { status: 400 });
  }
  try {
    const user = await consumeResetToken(token, password);
    if (!user) {
      return NextResponse.json({ error: "This link is expired or already used." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if ((err as Error).message === "PASSWORD_TOO_SHORT") {
      return NextResponse.json({ error: "Password needs at least 8 characters." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not reset password." }, { status: 500 });
  }
}
