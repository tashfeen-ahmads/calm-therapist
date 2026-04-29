import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export const runtime = "nodejs";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const claims = await verifySession(token);
  if (!claims) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  const user = getUserById(claims.sub);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({
    user: { email: user.email, name: user.name, plan: user.plan },
  });
}
