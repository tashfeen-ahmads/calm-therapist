"use client";

import { Style } from "@/components/ui/Style";

import Link from "next/link";

const CONDITIONS = [
  { slug: "anxiety", title: "Anxiety", desc: "The weight that won't lift." },
  { slug: "depression", title: "Depression", desc: "When getting up is the hardest part." },
  { slug: "grief", title: "Grief", desc: "Loss takes as long as it takes." },
  { slug: "burnout", title: "Burnout", desc: "When the person who holds everything together is falling apart." },
  { slug: "relationships", title: "Relationships", desc: "The ones we hurt and the ones that hurt us." },
];

export function ConditionPaths() {
  return (
    <section style={{ background: "var(--calm-mist)", padding: "120px 24px" }}>
      <div className="container">
        <h2 style={{ marginBottom: 56, maxWidth: 760 }}>
          You don&apos;t need to be in crisis to use Calm Therapist.
        </h2>

        <div
          className="condition-row no-scrollbar"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
          }}
        >
          {CONDITIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/for/${c.slug}`}
              style={{
                background: "var(--calm-white)",
                border: "1px solid var(--calm-ink-10)",
                borderLeft: "3px solid var(--calm-forest)",
                borderRadius: 12,
                padding: 24,
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minHeight: 180,
                transition: "transform 0.2s ease",
              }}
            >
              <h4 style={{ fontSize: 22 }}>{c.title}</h4>
              <p style={{ fontSize: 14, color: "var(--calm-ink)", lineHeight: 1.6 }}>{c.desc}</p>
              <span
                style={{
                  marginTop: "auto",
                  fontSize: 13,
                  color: "var(--calm-forest)",
                  fontWeight: 500,
                }}
              >
                For {c.title.toLowerCase()} →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Style>{`
        @media (max-width: 960px) {
          .condition-row {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          .condition-row > * {
            flex: 0 0 70%;
            scroll-snap-align: start;
          }
        }
      `}</Style>
    </section>
  );
}
