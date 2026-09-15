import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { reviewsByUser } from "@/lib/feedback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A member's own reviews, for the Reviews tab in their dashboard.
 *
 * Returns their words and where each one stands. It deliberately does not
 * expose the admin's internal status field — only whether the review is live
 * on the site, still being read, or not being published — because "rejected"
 * is a decision about a marketing page, not a judgement of the person.
 */
export async function GET() {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const rows = await reviewsByUser(claims.sub);
  return NextResponse.json({
    reviews: rows.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      publicConsent: r.publicConsent,
      state: r.published ? "published" : r.rejectedAt ? "not-published" : "pending",
      adminResponse: r.adminResponse,
      respondedAt: r.respondedAt,
    })),
  });
}
