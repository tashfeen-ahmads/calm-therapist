import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { POSTS } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

export const metadata = pageMetadata({
  title: `Blog | Notes on AI therapy, memory, and being heard | ${BRAND.name}`,
  description: "Honest writing about what AI therapy gets wrong, what memory changes, who owns your mental-health data, and what circles teach us.",
  path: "/blog",
});

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return (
    <PageShell>
      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>Blog</p>
          <h1 style={{ marginBottom: 24, fontSize: "clamp(32px, 6vw, 56px)" }}>Notes from building a free AI therapist.</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-70)", marginBottom: 48 }}>
            What AI therapy gets wrong, what memory changes, and what we are learning as members arrive.
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 10 }}>
                  {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {p.readingMinutes} min
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  width={1200}
                  height={630}
                  style={{ width: "100%", height: "auto", borderRadius: 10, marginBottom: 14, display: "block" }}
                />
                <h2 style={{ fontSize: "clamp(21px, 3vw, 28px)", marginBottom: 8 }}>{p.title}</h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>{p.description}</p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/ai-therapist" className="btn-ghost">What an AI therapist is</Link>
            <Link href="/free-ai-therapist" className="btn-ghost">Free AI therapist</Link>
            <Link href="/circles" className="btn-ghost">Circles</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
