import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { captureFeedback } from "@/lib/feedback";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const claims = await verifySession(token);
  if (!claims) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  let body: { rating?: number; comment?: string; publicConsent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const rating = Number(body.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5." }, { status: 400 });
  }

  const record = await captureFeedback({
    userId: claims.sub,
    userName: claims.name,
    userEmail: claims.email,
    rating,
    comment: typeof body.comment === "string" ? body.comment : "",
    publicConsent: body.publicConsent === true,
  });

  return NextResponse.json({
    ok: true,
    category: record.category,
    id: record.id,
  });
}
