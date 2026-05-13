import { NextResponse } from "next/server";
import { consumeVerifyToken } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const token = (body.token ?? "").trim();
  if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });

  const user = await consumeVerifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "This link is expired or already used." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, email: user.email });
}
