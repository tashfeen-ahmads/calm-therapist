import { Style } from "@/components/ui/Style";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { pageMetadata } from "@/lib/seo";

interface Campaign {
  slug: string;
  headline: string;
  sub: string;
  bullets: string[];
  ctaLabel: string;
  testimonials: { name: string; text: string }[];
}

const CAMPAIGNS: Record<string, Campaign> = {
  "anxiety-meta": {
    slug: "anxiety-meta",
    headline: "Still explaining yourself to a therapist who forgets?",
    sub: "Calm Therapist remembers every session. Voice when typing is hard. Real help, no waiting list.",
    bullets: [
      "Built for anxiety — voice mode for the moments typing is impossible.",
      "Memory across every session. You don't repeat your story.",
      "Free to try. Backed by Implenix.",
    ],
    ctaLabel: "Start your first session",
    testimonials: [
      { name: "Priya, 28", text: "I can't type when I'm anxious. But I can speak. Calm Therapist listens." },
      { name: "Maya, 33", text: "It noticed I get worse on Tuesdays before I did." },
      { name: "Daniel, 29", text: "I don't have to explain my whole life every time. It already knows." },
    ],
  },
  "men-burnout": {
    slug: "men-burnout",
    headline: "You don't need therapy. You need somewhere to think.",
    sub: "Calm Therapist is direct. No therapy vocabulary. No hand-holding. Just a tool that helps you see the shape of your week.",
    bullets: [
      "Direct tone option. No comfort-speak.",
      "Voice mode while you walk, drive, or pace.",
      "Pattern detection — sleep, work, weekends — across the long view.",
    ],
    ctaLabel: "Try it free",
    testimonials: [
      { name: "Tom, 38", text: "Twelve identical arguments in one year. I had no idea." },
      { name: "Yusuf, 36", text: "It saw the pattern in my weeks before I did. I cut three meetings." },
      { name: "James, 41", text: "It doesn't feel like therapy. It feels like finally having somewhere to think out loud." },
    ],
  },
  "spanish-en": {
    slug: "spanish-en",
    headline: "A quiet place to think — in English, Spanish, or French.",
    sub: "Calm Therapist works in English, Spanish, and French. Voice when typing's too much. Real privacy. Real help.",
    bullets: [
      "English, Spanish, French — full conversational support.",
      "Voice mode for the moments words come slowly.",
      "No data sold, no models trained on your story.",
    ],
    ctaLabel: "Start free",
    testimonials: [
      { name: "Lucia, 33", text: "Switching between English and Spanish mid-sentence — it just worked." },
      { name: "Aisha, 27", text: "It remembered my mother's name. I didn't have to explain again." },
      { name: "Daniel, 29", text: "Voice mode at 2am, walking, was the only thing that worked." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(CAMPAIGNS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = CAMPAIGNS[params.slug];
  if (!c) return {};
  return pageMetadata({
    title: `${c.headline} | Calm Therapist`,
    description: c.sub,
    path: `/lp/${c.slug}`,
  });
}

export default function LpPage({ params }: { params: { slug: string } }) {
  const c = CAMPAIGNS[params.slug];
  if (!c) return notFound();

  const ctaHref = `/auth/signup?utm_source=meta&utm_campaign=${c.slug}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--calm-white)" }}>
      <header style={{ padding: "24px 24px", display: "flex", justifyContent: "center" }}>
        <Logo animated={false} href={null} />
      </header>

      <main style={{ padding: "32px 24px 64px" }}>
        <section style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ marginBottom: 24, fontSize: 56, lineHeight: 1.1 }}>{c.headline}</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 40 }}>
            {c.sub}
          </p>
          <Link href={ctaHref} className="btn-primary" style={{ height: 52, padding: "0 32px", fontSize: 15 }}>
            {c.ctaLabel}
          </Link>
        </section>

        <section style={{ maxWidth: 760, margin: "80px auto 0" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {c.bullets.map((b) => (
              <li
                key={b}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: 24,
                  background: "var(--calm-mist)",
                  borderRadius: 12,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "var(--calm-forest)",
                    marginTop: 10,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 17, lineHeight: 1.7 }}>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ maxWidth: 1040, margin: "80px auto 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="lp-testi-grid">
            {c.testimonials.map((t) => (
              <div key={t.name} className="card">
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontStyle: "italic",
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: "var(--calm-ink)",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <p style={{ fontSize: 13, color: "var(--calm-ink-40)", marginTop: 16 }}>{t.name}</p>
              </div>
            ))}
          </div>
          <Style>{`@media (max-width: 800px) { .lp-testi-grid { grid-template-columns: 1fr !important; } }`}</Style>
        </section>

        <section style={{ maxWidth: 760, margin: "80px auto 0", textAlign: "center" }}>
          <Link href={ctaHref} className="btn-primary" style={{ height: 52, padding: "0 32px", fontSize: 15 }}>
            {c.ctaLabel}
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--calm-ink-40)" }}>
            Backed by{" "}
            <a href="http://Implenix.net" target="_blank" rel="noopener noreferrer">
              Implenix.net
            </a>
            . Your data belongs to you.
          </p>
        </section>
      </main>
    </div>
  );
}
