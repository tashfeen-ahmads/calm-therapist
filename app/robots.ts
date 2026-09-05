import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/onboarding", "/api", "/auth", "/admin"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
