import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { GLOSSARY } from "@/lib/seo-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Calm Therapist Glossary | Plain-English Mental-Wellness Terms",
  description:
    "Cognitive distortions, rumination, self-reflection — the words mental-wellness people use, explained without jargon. Part of Calm Therapist.",
  path: "/glossary",
});

export default function GlossaryIndex() {
  const entries = Object.values(GLOSSARY);
  return (
    <PageShell>
      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>
            Glossary
          </p>
          <h1 style={{ marginBottom: 24 }}>The words, explained without jargon.</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-70)", marginBottom: 56 }}>
            A small set of terms worth understanding. Not because you need to be clinical — just
            because the words make some patterns easier to notice.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {entries.map((e) => (
              <Link
                key={e.slug}
                href={`/glossary/${e.slug}`}
                className="card"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <h3 style={{ marginBottom: 8 }}>{e.h1.replace(/[—.].*$/, "").trim()}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>{e.intro}</p>
                <p className="body-micro" style={{ color: "var(--calm-forest)", marginTop: 12 }}>
                  Read more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
