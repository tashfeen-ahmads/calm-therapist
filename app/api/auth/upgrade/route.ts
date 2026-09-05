import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Retired. Plans are never changed from the client. During the free period
 * access is decided by lib/access.ts; later, only the Stripe webhook may
 * change a plan. Kept as a route so old clients get a clear answer.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Plans cannot be changed here. Access is decided by your membership; see Settings." },
    { status: 410 }
  );
}
