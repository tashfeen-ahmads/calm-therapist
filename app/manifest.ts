import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

/** Installable web app: a home-screen icon and full-screen mode, no store needed. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: "A place to think out loud with Aura. Chat, voice, and circles.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#4A7A6D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
