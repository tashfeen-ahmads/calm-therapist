import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { stripe, stripeEnabled, priceForCadence, assertPricesConfigured } from "@/lib/stripe";
import { getUserById } from "@/lib/users";
import { dbEnabled, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  let body: { cadence?: "monthly" | "yearly" };
  try { body = await req.json(); } catch { body = {}; }
  const cadence = body.cadence === "yearly" ? "yearly" : "monthly";

  // Mock fallback when Stripe isn't configured — keeps the demo flow alive.
  if (!stripeEnabled) {
    return NextResponse.json({
      mock: true,
      message: "Stripe not configured. Use /api/auth/upgrade for the demo flow.",
    }, { status: 200 });
  }

  try {
    assertPricesConfigured("subscription");
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  // Find or create the Stripe customer.
  let stripeCustomerId: string | undefined;
  if (dbEnabled) {
    const user = await prisma.user.findUnique({ where: { id: claims.sub } });
    stripeCustomerId = user?.stripeCustomerId ?? undefined;
    if (!stripeCustomerId) {
      const customer = await stripe().customers.create({
        email: claims.email,
        name: claims.name,
        metadata: { userId: claims.sub },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: claims.sub },
        data: { stripeCustomerId },
      });
    }
  } else {
    // No DB — create a fresh customer each time. Fine for dev only.
    const user = await getUserById(claims.sub);
    const customer = await stripe().customers.create({
      email: user?.email ?? claims.email,
      name: user?.name ?? claims.name,
      metadata: { userId: claims.sub },
    });
    stripeCustomerId = customer.id;
  }

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: priceForCadence(cadence), quantity: 1 }],
    success_url: `${APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${APP_URL}/dashboard?upgrade=cancelled`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { userId: claims.sub, cadence },
    },
    metadata: { userId: claims.sub, cadence, kind: "subscription" },
  });

  return NextResponse.json({ url: session.url });
}
