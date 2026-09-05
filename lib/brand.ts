/**
 * One place for the product's name. The rebrand to the new domain is a
 * change to NEXT_PUBLIC_BRAND_NAME and NEXT_PUBLIC_APP_URL, not a code change.
 * Aura, the companion, keeps her name across brands.
 */
export const BRAND = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Calm Therapist",
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT ?? "Calm",
  agent: "Aura",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://calm-therapist.netlify.app",
  tagline: "A free AI therapist that remembers you.",
  description:
    "Chat with Aura for free, any hour. Voice when typing is too much. Small anonymous circles, hosted by Aura, when you want company. Crisis-aware from the first message.",
  parent: { name: "Implenix", url: "https://implenix.net" },
} as const;
