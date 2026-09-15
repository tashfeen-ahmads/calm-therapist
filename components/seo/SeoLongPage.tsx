import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { JsonLd, breadcrumbSchema, faqSchema, medicalWebPageSchema, citationSchema, speakableSchema } from "@/lib/seo";
import { AUTHOR, REVIEWER, EDITORIAL_POLICY_PATH } from "@/lib/authorship";
import type { SeoPage } from "@/lib/seo-pages";
import { BRAND } from "@/lib/brand";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface Props {
  page: SeoPage;
  /** Path used in the breadcrumb schema, e.g. "/ai-therapist". */
  path: string;
}

export function SeoLongPage({ page, path }: Props) {
  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: BRAND.name, path: "/" },
          { name: page.h1, path },
        ])}
      />
      <JsonLd data={faqSchema(page.faqs)} />
      <JsonLd data={speakableSchema(path)} />
      <JsonLd
        data={{
          ...medicalWebPageSchema({ title: page.title, description: page.description, path }),
          ...(page.sources?.length ? { citation: citationSchema(page.sources) } : {}),
        }}
      />

      <article className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Learn", href: "/ai-therapist" }, { name: page.h1 }]} />
          <h1 style={{ marginBottom: 24, fontSize: 56, lineHeight: 1.1 }}>{page.h1}</h1>
          <p className="body-large answer-lede" style={{ color: "var(--calm-ink-70)", marginBottom: 24 }}>
            {page.intro}
          </p>

          <p style={{ fontSize: 13, color: "var(--calm-ink-40)", marginBottom: 48, lineHeight: 1.7 }}>
            By {AUTHOR.name}.{" "}
            {REVIEWER
              ? `Clinically reviewed by ${REVIEWER.name}, ${REVIEWER.credential}.`
              : "Not reviewed by a licensed clinician, and not a substitute for one."}{" "}
            <Link href={EDITORIAL_POLICY_PATH} style={{ color: "var(--calm-forest)" }}>
              How we research and write
            </Link>
            .
          </p>

          {page.sections.map((s, i) => (
            <section key={i} style={{ marginBottom: 40 }}>
              <h2 style={{ marginBottom: 16 }}>{s.heading}</h2>
              {(s.paragraphs ?? []).map((p, j) => (
                <p key={j} style={{ fontSize: 17, lineHeight: 1.85, marginBottom: 16, color: "var(--calm-ink)" }}>
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        fontSize: 16,
                        lineHeight: 1.7,
                        color: "var(--calm-ink)",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: "var(--calm-forest)",
                          marginTop: 10,
                          flexShrink: 0,
                        }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--calm-ink-10)" }}>
            <h2 style={{ marginBottom: 24 }}>Common questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {page.faqs.map((f) => (
                <details key={f.q} className="card" style={{ padding: 20 }}>
                  <summary style={{ fontSize: 16, fontWeight: 500, listStyle: "none" }}>{f.q}</summary>
                  <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.8, color: "var(--calm-ink-70)" }}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {page.sources && page.sources.length > 0 && (
            <section style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--calm-ink-10)" }}>
              <h2 style={{ marginBottom: 16, fontSize: 22 }}>Sources</h2>
              <ol
                style={{
                  paddingLeft: 20,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--calm-ink-70)",
                }}
              >
                {page.sources.map((src) => (
                  <li key={src.url}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--calm-forest)" }}
                    >
                      {src.label}
                    </a>
                    {src.publisher ? ` — ${src.publisher}` : ""}
                    {src.year ? `, ${src.year}` : ""}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section
            style={{
              marginTop: 56,
              padding: 32,
              background: "var(--calm-mist)",
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 20 }}>{page.ctaLine}</p>
            <Link href="/" className="btn-primary">
              Try one sentence
            </Link>
          </section>

          <section style={{ marginTop: 48 }}>
            <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>
              Related
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {page.related.filter((r) => r.href !== path).map((r) => (
                <Link key={r.href} href={r.href} className="btn-ghost">
                  {r.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
