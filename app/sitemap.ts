import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { MODE_LIST } from "@/lib/features";
import { PAGES, GLOSSARY } from "@/lib/seo-pages";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: "monthly" | "weekly" | "daily" }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/how-it-works", priority: 0.9, freq: "monthly" },
    { path: "/features", priority: 0.85, freq: "monthly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/privacy", priority: 0.6, freq: "monthly" },
  ];

  const modes = MODE_LIST.map((m) => ({
    path: `/features/${m.slug}`,
    priority: 0.8,
    freq: "monthly" as const,
  }));

  const conditions = ["anxiety", "depression", "grief", "burnout", "relationships"].map((s) => ({
    path: `/for/${s}`,
    priority: 0.85,
    freq: "monthly" as const,
  }));

  const blog = POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    priority: 0.75,
    freq: "monthly" as const,
    lastMod: new Date(p.publishedAt),
  }));

  const seoPillars = Object.keys(PAGES).map((slug) => ({
    path: `/${slug}`,
    priority: 0.9,
    freq: "monthly" as const,
  }));

  const glossary = [
    { path: "/glossary", priority: 0.7, freq: "monthly" as const },
    ...Object.keys(GLOSSARY).map((slug) => ({
      path: `/glossary/${slug}`,
      priority: 0.65,
      freq: "monthly" as const,
    })),
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...modes.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...conditions.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...blog.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: p.lastMod,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...seoPillars.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...glossary.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
  ];
}
