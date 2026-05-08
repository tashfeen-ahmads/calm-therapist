import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { stripe, stripeEnabled, stripePrices, assertPricesConfigured } from "@/lib/stripe";
import { dbEnabled, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Voice top-up Checkout. One-time $12 charge → webhook applies the bonus
 * minutes via lib/voice-quota's applyTopup. Only Pro users can buy this.
 */
export async function POST() {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  if (claims.plan !== "pro") {
    return NextResponse.json(
      { error: "Top-ups are for Pro accounts. Open your space first." },
      { status: 403 }
    );
  }

  if (!stripeEnabled) {
    return NextResponse.json({ mock: true });
  }

  try {
    assertPricesConfigured("topup");
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  // Reuse the customer if we have one stored.
  let stripeCustomerId: string | undefined;
  if (dbEnabled) {
    const user = await prisma.user.findUnique({ where: { id: claims.sub } });
    stripeCustomerId = user?.stripeCustomerId ?? undefined;
  }

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    customer_email: stripeCustomerId ? undefined : claims.email,
    line_items: [{ price: stripePrices().topup, quantity: 1 }],
    success_url: `${APP_URL}/dashboard/voice?topup=success`,
    cancel_url: `${APP_URL}/dashboard/voice?topup=cancelled`,
    metadata: { userId: claims.sub, kind: "topup" },
    payment_intent_data: {
      metadata: { userId: claims.sub, kind: "topup" },
    },
  });

  return NextResponse.json({ url: session.url });
}
