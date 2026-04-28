import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/lib/seo";

export interface ConditionPageProps {
  slug: string;
  condition: string;
  h1: string;
  feeling: string[];
  whyFails: string;
  ctFeatures: { title: string; body: string; href: string }[];
  modeLinks: { href: string; label: string }[];
  testimonials: { name: string; text: string }[];
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
}

export function ConditionPageTemplate(p: ConditionPageProps) {
  return (
    <PageShell>
      <JsonLd data={faqSchema(p.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Calm Therapist", path: "/" },
          { name: p.condition, path: `/for/${p.slug}` },
        ])}
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>
            For {p.condition.toLowerCase()}
          </p>
          <h1 style={{ marginBottom: 24 }}>{p.h1}</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-40)" }}>
            Calm Therapist is built around how {p.condition.toLowerCase()} actually works — memory,
            voice when typing is hard, and a longitudinal record so you don&apos;t start over every
            time.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/onboarding/step-1" className="btn-primary">Start free</Link>
            <Link href="/how-it-works" className="btn-ghost">How it works</Link>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--calm-mist)", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ marginBottom: 32 }}>What {p.condition.toLowerCase()} actually feels like</h2>
          {p.feeling.map((p2, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.85, marginBottom: 16 }}>
              {p2}
            </p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 style={{ marginBottom: 24 }}>Why standard tools fail people with {p.condition.toLowerCase()}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.85 }}>{p.whyFails}</p>
        </div>
      </section>

      <section style={{ background: "var(--calm-white)", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <h2 style={{ marginBottom: 48 }}>How Calm Therapist is different</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="ct-grid">
            {p.ctFeatures.map((f) => (
              <Link key={f.title} href={f.href} className="card" style={{ textDecoration: "none", color: "inherit" }}>
                <h4 style={{ marginBottom: 12 }}>{f.title}</h4>
                <p style={{ fontSize: 14, color: "var(--calm-ink-40)", lineHeight: 1.7 }}>{f.body}</p>
              </Link>
            ))}
          </div>
          <style>{`@media (max-width: 800px) { .ct-grid { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      </section>

      <section style={{ background: "var(--calm-mist)", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 style={{ marginBottom: 32 }}>Most relevant modes</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {p.modeLinks.map((m) => (
              <Link key={m.href} href={m.href} className="btn-ghost">
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 style={{ marginBottom: 48 }}>What people with {p.condition.toLowerCase()} say</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {p.testimonials.map((t) => (
              <div key={t.name} className="card-mist">
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontStyle: "italic",
                    fontSize: 22,
                    lineHeight: 1.5,
                    color: "var(--calm-ink)",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <p style={{ fontSize: 14, color: "var(--calm-ink-40)", marginTop: 16 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--calm-white)", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ marginBottom: 32 }}>Frequently asked</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {p.faqs.map((f, i) => (
              <details key={i} className="card" style={{ padding: 24, cursor: "pointer" }}>
                <summary style={{ fontSize: 16, fontWeight: 500, listStyle: "none" }}>{f.q}</summary>
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.8, color: "var(--calm-ink-40)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
          <h2 style={{ marginBottom: 24 }}>Start your first session.</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
            No appointment. No waiting. No judgment.
          </p>
          <Link href="/onboarding/step-1" className="btn-primary">Begin with Calm Therapist</Link>

          <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {p.related.map((r) => (
              <Link key={r.href} href={r.href} className="btn-ghost">{r.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
