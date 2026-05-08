import Stripe from "stripe";

/**
 * Stripe client + configuration.
 *
 * stripeEnabled is the gate every billing endpoint checks. When false, the
 * UI falls back to the mock /api/auth/upgrade flow so the demo still works
 * without any Stripe credentials configured.
 */

export const stripeEnabled = !!process.env.STRIPE_SECRET_KEY;

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    // Let the SDK pin its own API version so upgrades don't break us.
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    } as Stripe.StripeConfig);
  }
  return _stripe;
}

export interface StripePrices {
  monthly: string;
  yearly: string;
  topup: string;
}

export function stripePrices(): StripePrices {
  return {
    monthly: process.env.STRIPE_PRICE_MONTHLY ?? "",
    yearly: process.env.STRIPE_PRICE_YEARLY ?? "",
    topup: process.env.STRIPE_PRICE_TOPUP ?? "",
  };
}

export function priceForCadence(cadence: "monthly" | "yearly"): string {
  const p = stripePrices();
  return cadence === "yearly" ? p.yearly : p.monthly;
}

/**
 * Check that all the price IDs we need are set. Used by the checkout
 * endpoints so we fail loud and early instead of with a Stripe error.
 */
export function assertPricesConfigured(kind: "subscription" | "topup") {
  const p = stripePrices();
  if (kind === "subscription") {
    if (!p.monthly || !p.yearly) {
      throw new Error("STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY missing");
    }
  } else if (kind === "topup") {
    if (!p.topup) throw new Error("STRIPE_PRICE_TOPUP missing");
  }
}
