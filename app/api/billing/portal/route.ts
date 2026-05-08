import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { dbEnabled, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Stripe Customer Portal session. Lets the user pause, resume, cancel,
 * change card, or download invoices on Stripe-hosted UI. Cheaper to keep
 * us out of all that than to build it.
 *
 * Configure the portal in:
 *   Stripe dashboard → Settings → Billing → Customer portal
 * Make sure "pause" + "cancel" are both enabled.
 */
export async function POST() {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  if (!stripeEnabled) {
    return NextResponse.json({ mock: true }, { status: 200 });
  }

  if (!dbEnabled) {
    return NextResponse.json(
      { error: "Customer portal needs DATABASE_URL set so we can find your Stripe customer." },
      { status: 500 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: claims.sub } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No subscription on file yet." },
      { status: 404 }
    );
  }

  const session = await stripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${APP_URL}/dashboard/settings`,
  });

  return NextResponse.json({ url: session.url });
}
