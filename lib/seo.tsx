import type { Metadata } from "next";
import { BRAND } from "./brand";
import { AUTHOR, REVIEWER, EDITORIAL_POLICY_PATH, type Source } from "./authorship";

const BASE_URL = BRAND.url;

interface PageMetaArgs {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export function pageMetadata({ title, description, path, ogImage = "/og-image.png" }: PageMetaArgs): Metadata {
  const url = `${BASE_URL}${path}`;
  return {
    // Absolute: page titles already carry the brand, so the root template must not append it again.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Calm AI Therapy",
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
    name: BRAND.name,
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
    sameAs: (process.env.NEXT_PUBLIC_SOCIAL_URLS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    description: BRAND.description,
  };
}

/** Names the site for sitelinks and the knowledge panel. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: BASE_URL,
    inLanguage: ["en", "ur", "hi", "ar", "es", "fr"],
    publisher: { "@type": "Organization", name: BRAND.name, url: BASE_URL },
  };
}

/**
 * The author, as a named entity rather than a bare organisation.
 *
 * Google's quality raters treat an unnamed corporate author as a weak signal
 * on YMYL topics, which mental health is. A named entity with stated expertise
 * and a link to a published editorial process is what they are looking for.
 */
export function authorSchema() {
  return {
    "@type": "Organization",
    name: AUTHOR.name,
    url: `${BASE_URL}${EDITORIAL_POLICY_PATH}`,
    description: AUTHOR.credential,
    knowsAbout: [
      "AI therapy",
      "digital mental health",
      "cognitive behavioural therapy",
      "crisis intervention",
    ],
  };
}

/**
 * Reviewer credit, emitted only when a qualified person has actually reviewed
 * the content. Returns null otherwise: a fabricated reviewer on health content
 * is worse than no reviewer at all, both for the reader and for the site.
 */
export function reviewerSchema() {
  if (!REVIEWER) return null;
  return {
    "@type": "Person",
    name: REVIEWER.name,
    jobTitle: REVIEWER.credential,
    ...(REVIEWER.url ? { url: REVIEWER.url } : {}),
  };
}

/**
 * Pages that discuss a condition are MedicalWebPage, not plain WebPage. It
 * tells Google the page knows what it is, and carries the fields that YMYL
 * assessment looks for: the last review date, who reviewed it, and the
 * explicit statement that this is not medical advice.
 */
export function medicalWebPageSchema(args: {
  title: string;
  description: string;
  path: string;
  condition?: string;
  reviewedAt?: string;
}) {
  const reviewer = reviewerSchema();
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: args.title,
    description: args.description,
    url: `${BASE_URL}${args.path}`,
    inLanguage: "en",
    author: authorSchema(),
    ...(reviewer ? { reviewedBy: reviewer, lastReviewed: args.reviewedAt } : {}),
    ...(args.condition
      ? { about: { "@type": "MedicalCondition", name: args.condition } }
      : {}),
    // Says out loud what the disclaimer says in prose.
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
    isPartOf: { "@type": "WebSite", name: BRAND.name, url: BASE_URL },
  };
}

/** Renders a page's reference list into schema so the citations are machine-readable. */
export function citationSchema(sources: Source[]) {
  return sources.map((s) => ({
    "@type": "CreativeWork",
    name: s.label,
    url: s.url,
    ...(s.publisher ? { publisher: { "@type": "Organization", name: s.publisher } } : {}),
    ...(s.year ? { datePublished: String(s.year) } : {}),
  }));
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
  updatedAt?: string;
  /** The post's own feature image, rather than the site-wide social card. */
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    datePublished: args.publishedAt,
    dateModified: args.updatedAt ?? args.publishedAt,
    author: authorSchema(),
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` },
    },
    image: [`${BASE_URL}${args.image ?? "/og-image.png"}`],
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${args.slug}` },
  };
}

export function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How ${BRAND.name} works`,
    step: [
      { "@type": "HowToStep", position: 1, name: "Say one sentence", text: "Try Aura on the homepage with no signup. One message, one reply." },
      { "@type": "HowToStep", position: 2, name: "Tell Aura who you are", text: "A five-minute onboarding: what is on your mind, how you want to be spoken to, your language and culture." },
      { "@type": "HowToStep", position: 3, name: "Chat or talk", text: "Chat is free, always. Voice when typing is too much. Aura remembers across both." },
      { "@type": "HowToStep", position: 4, name: "Sit in a circle", text: "Small anonymous rooms of people carrying the same thing, hosted by Aura, once circles open." },
    ],
  };
}

/** The product as a free web app, for rich results on "free AI therapist" queries. */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND.name,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: BASE_URL,
    description: BRAND.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Chat with Aura is free for everyone." },
    featureList: ["Free AI therapist chat", "Voice sessions", "Anonymous support circles", "Crisis-aware safety layer", "Memory across sessions", "English, Urdu, Hindi, Arabic, Spanish, French"],
    publisher: { "@type": "Organization", name: BRAND.name, url: BASE_URL },
  };
}


/**
 * Marks the short, direct answer at the top of a page as the speakable part.
 *
 * Answer engines — AI Overviews, Perplexity, ChatGPT search — extract a
 * concise answer and cite the page it came from. The research is consistent
 * that pages leading with a plain-language answer before the explanation get
 * cited; pages that build up to the answer get read and dropped. This marks
 * which element is that answer.
 */
export function speakableSchema(path: string, selectors: string[] = ["h1", ".answer-lede"]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${BASE_URL}${path}`,
    speakable: { "@type": "SpeakableSpecification", cssSelector: selectors },
  };
}

/**
 * Aggregate rating from approved member reviews.
 *
 * On YMYL topics, review and rating signals now carry real weight in who
 * ranks. Emitted only when there are genuine approved reviews behind it —
 * an invented rating is both a manual-action risk and a lie about what
 * other people thought of a mental health product.
 */
export function aggregateRatingSchema(args: { ratingValue: number; reviewCount: number }) {
  if (!args.reviewCount || args.reviewCount < 1) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: Number(args.ratingValue.toFixed(1)),
    reviewCount: args.reviewCount,
    bestRating: 5,
    worstRating: 1,
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
