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
  moments: { name: string; text: string }[];
}

const CAMPAIGNS: Record<string, Campaign> = {
  "anxiety-meta": {
    slug: "anxiety-meta",
    headline: "Still explaining yourself to a therapist who forgets?",
    sub: "Calm Therapist remembers every session. Voice when typing is hard. Real help, no waiting list.",
    bullets: [
      "Built for anxiety — voice mode for the moments typing is impossible.",
      "Memory across every session. You don't repeat your story.",
      "Chat is free, always. No card.",
    ],
    ctaLabel: "Start your first session",
    moments: [
      { name: "When typing is impossible", text: "Hands shaking, chest tight. You talk, Aura listens without rushing." },
      { name: "The pattern you cannot see", text: "Worse on Tuesdays. Aura remembers the weeks and can say so." },
      { name: "No re-explaining", text: "Aura already knows the context. The conversation starts where you are." },
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
    moments: [
      { name: "The same argument, again", text: "Twelve identical arguments in a year, seen written down for the first time." },
      { name: "The week in the long view", text: "Sleep, meetings, weekends: the pattern is visible from outside the week." },
      { name: "Somewhere to think", text: "Not therapy vocabulary. A direct tone and a place to put it down." },
    ],
  },
  "spanish-en": {
    slug: "spanish-en",
    headline: "A quiet place to think — in your language.",
    sub: "Aura works in English, Urdu, Hindi, Arabic, Spanish, and French, and switches when you do. Voice when typing's too much. Real privacy.",
    bullets: [
      "English, Urdu, Hindi, Arabic, Spanish, French — and the mix between.",
      "Voice mode for the moments words come slowly.",
      "No data sold, no models trained on your story.",
    ],
    ctaLabel: "Start free",
    moments: [
      { name: "Mid-sentence", text: "Start in English, finish in Urdu. Aura follows without being asked." },
      { name: "Your mother's name", text: "Said once, remembered. You do not explain the family again." },
      { name: "2am, walking", text: "Voice when you cannot face anyone else in the room." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(CAMPAIGNS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = CAMPAIGNS[params.slug];
  if (!c) return {};
  return {
    ...pageMetadata({ title: `${c.headline} | Calm Therapist`, description: c.sub, path: `/lp/${c.slug}` }),
    robots: { index: false, follow: true },
  };
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
            {c.moments.map((t) => (
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
            <a href="https://implenix.net" target="_blank" rel="noopener noreferrer">
              Implenix.net
            </a>
            . Your data belongs to you.
          </p>
        </section>
      </main>
    </div>
  );
}
