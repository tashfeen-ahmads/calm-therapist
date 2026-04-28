import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

interface PageMetaArgs {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export function pageMetadata({ title, description, path, ogImage = "/og-image.png" }: PageMetaArgs): Metadata {
  const url = `${BASE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Calm Therapist",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Calm Therapist",
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
    parentOrganization: { "@type": "Organization", name: "Implenix", url: "https://implenix.net" },
    sameAs: ["https://implenix.net"],
    description:
      "Calm Therapist is an AI therapy platform that remembers every session, supports voice, chat, journaling, and crisis safety, and is backed by Implenix.",
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(args: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    datePublished: args.publishedAt,
    author: {
      "@type": "Organization",
      name: "Calm Therapist Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "Calm Therapist",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${args.slug}` },
  };
}

export function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Calm Therapist Works",
    step: [
      { "@type": "HowToStep", position: 1, name: "Tell Calm Therapist who you are", text: "Onboard in 5 minutes — share what's on your mind, your goals, and how you want to be spoken to." },
      { "@type": "HowToStep", position: 2, name: "Choose your mode", text: "Voice, chat, or journaling — switch any time." },
      { "@type": "HowToStep", position: 3, name: "Build a longitudinal record", text: "Every session feeds the next. Memory, mood, and patterns build over weeks." },
      { "@type": "HowToStep", position: 4, name: "Reflect monthly", text: "See your own words back to you in a monthly review." },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE_URL}${it.path}`,
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
