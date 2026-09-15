import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { setReviewPublished } from "@/lib/feedback";

export const runtime = "nodejs";

/**
 * Approve or decline a review for the public site.
 *
 * Nothing a member writes reaches a marketing page without passing through
 * here. Rejecting does not delete anything: the feedback is still worth
 * reading and the member may still deserve a reply.
 */
export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { id?: string; published?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (typeof body.published !== "boolean") {
    return NextResponse.json({ error: "published must be true or false" }, { status: 400 });
  }

  const record = await setReviewPublished(body.id, body.published);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ record });
}
