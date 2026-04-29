import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { FEATURE_LIST } from "@/lib/features";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Therapy Features | Calm Therapist — Voice, Chat, Journal, Reflect, Crisis",
  description:
    "Explore the five features of Calm Therapist. Voice agent, chat agent, weekly journal, monthly reflect, and crisis safe — all built on a longitudinal memory.",
  path: "/features",
});

export default function FeaturesIndex() {
  return (
    <PageShell>
      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>
            Features
          </p>
          <h1 style={{ marginBottom: 24 }}>Five ways Calm Therapist meets you.</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-70)", marginBottom: 56 }}>
            One person, five postures. Switch between them at will. Calm Therapist carries memory
            across all of them — what you said in voice shows up in your journal.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FEATURE_LIST.map((m) => (
              <Link
                key={m.key}
                href={`/features/${m.slug}`}
                className="card"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <h3 style={{ marginBottom: 8 }}>{m.label}</h3>
                <p style={{ fontSize: 16, color: "var(--calm-ink-70)" }}>{m.oneLiner}</p>
                <p className="body-micro" style={{ color: "var(--calm-forest)", marginTop: 16 }}>
                  Open feature →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
