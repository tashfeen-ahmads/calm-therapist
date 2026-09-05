import type { MetadataRoute } from "next";

import { BRAND } from "@/lib/brand";

const BASE = BRAND.url;

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
