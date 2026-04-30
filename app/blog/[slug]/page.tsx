import { Style } from "@/components/ui/Style";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/seo/PageShell";
import { POSTS, getPost } from "@/lib/blog";
import { JsonLd, articleSchema, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return notFound();

  return (
    <PageShell>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          slug: post.slug,
          publishedAt: post.publishedAt,
        })}
      />

      <article style={{ padding: "120px 24px 80px" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>
            Calm Therapist Editorial · {post.readingMinutes} min read
          </p>
          <h1 style={{ marginBottom: 32, fontSize: 56, lineHeight: 1.1 }}>{post.title}</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 24 }}>
            {post.description}
          </p>
          <p style={{ fontSize: 13, color: "var(--calm-ink-40)", marginBottom: 64 }}>
            Published{" "}
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · Backed by{" "}
            <a href="http://Implenix.net" target="_blank" rel="noopener noreferrer">
              Implenix.net
            </a>
          </p>

          {post.body.map((p, i) => (
            <p key={i} style={{ fontSize: 18, lineHeight: 1.85, marginBottom: 24, color: "var(--calm-ink)" }}>
              {p}
            </p>
          ))}

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--calm-ink-10)" }}>
            <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
              Continue exploring
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {post.internalLinks.map((l) => (
                <Link key={l.href} href={l.href} className="btn-ghost">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <section style={{ background: "var(--calm-mist)", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <h3 style={{ marginBottom: 32 }}>Related articles</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="related-grid">
            {post.related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="card"
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <h4>{r.title}</h4>
                <p className="body-micro" style={{ color: "var(--calm-forest)", marginTop: 16 }}>
                  Read →
                </p>
              </Link>
            ))}
          </div>
          <Style>{`@media (max-width: 700px) { .related-grid { grid-template-columns: 1fr !important; } }`}</Style>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
          <h2 style={{ marginBottom: 24 }}>Start your first session.</h2>
          <Link href="/auth/signup" className="btn-primary">Begin with Calm Therapist</Link>
        </div>
      </section>
    </PageShell>
  );
}
