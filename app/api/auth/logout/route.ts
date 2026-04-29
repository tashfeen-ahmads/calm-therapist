import { NextResponse } from "next/server";
import { clearSessionCookie, cookieDomainFor } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const host = req.headers.get("host");
  const cookie = clearSessionCookie({
    domain: cookieDomainFor(host),
    secure: process.env.NODE_ENV === "production",
  });
  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
    },
  });
}
