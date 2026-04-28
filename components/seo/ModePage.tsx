import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

export interface ModePageProps {
  slug: string;
  label: string;
  oneLiner: string;
  problem: { title: string; body: string };
  steps: { title: string; body: string }[];
  who: { title: string; body: string }[];
  related: { href: string; label: string }[];
  body: string[];
}

export function ModePageTemplate(props: ModePageProps) {
  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Calm Therapist", path: "/" },
          { name: "Modes", path: "/modes" },
          { name: props.label, path: `/modes/${props.slug}` },
        ])}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>
            Mode
          </p>
          <h1 style={{ marginBottom: 24 }}>{props.label}</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
            {props.oneLiner}
          </p>
          <Link href="/onboarding/step-1" className="btn-primary">
            Try {props.label.toLowerCase()} free
          </Link>
        </div>
      </section>

      <section style={{ background: "var(--calm-mist)", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 style={{ marginBottom: 24 }}>{props.problem.title}</h2>
          <p className="body-large">{props.problem.body}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 style={{ marginBottom: 48 }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }} className="how-grid">
            {props.steps.map((s, i) => (
              <div key={i} className="card">
                <p className="micro-label" style={{ color: "var(--calm-forest)" }}>
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h4 style={{ marginTop: 12, marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 14, color: "var(--calm-ink-40)" }}>{s.body}</p>
              </div>
            ))}
          </div>
          <style>{`@media (max-width: 800px) { .how-grid { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          {props.body.map((p, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.85, marginBottom: 20 }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--calm-mist)", padding: "80px 24px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <h2 style={{ marginBottom: 32 }}>Who this mode is for</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {props.who.map((s, i) => (
              <div key={i} className="card">
                <h4 style={{ marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 15, color: "var(--calm-ink-40)" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <h3 style={{ marginBottom: 24 }}>Related</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {props.related.map((r) => (
              <Link key={r.href} href={r.href} className="btn-ghost">
                {r.label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link href="/onboarding/step-1" className="btn-primary">
              Try {props.label.toLowerCase()} free
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
