import { Style } from "@/components/ui/Style";
import Link from "next/link";

const FOUNDING_CAP = process.env.NEXT_PUBLIC_FOUNDING_CAP ?? "150";

/**
 * Early-access pricing: nothing is for sale. The first members get
 * everything free for four months. Paid plans, when they arrive, are shown
 * inside the dashboard only. Chat with Aura stays free for everyone.
 */
export function Pricing() {
  return (
    <section id="pricing" style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
          <span className="micro-label" style={{ color: "var(--calm-forest)" }}>Early access</span>
          <h2 style={{ marginTop: 16, marginBottom: 16 }}>Free for the first {FOUNDING_CAP} members.</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-70)" }}>
            We are building this with the people who use it. Join now and everything is open for
            four months: chat, voice, and circles when they arrive. No card, no limits, no catch.
          </p>
        </div>

        <div
          className="pricing-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto" }}
        >
          <Card
            title="Founding member"
            headline="Free · four months"
            badge={`First ${FOUNDING_CAP}`}
            features={[
              "Unlimited chat with Aura",
              "Voice sessions, fair-use 60 minutes a month",
              "A seat in circles when they open",
              "Your record, kept and yours",
              "Crisis-aware from message one",
            ]}
            cta="Take a founding seat"
            href="/auth/signup"
            primary
          />
          <Card
            title="After that"
            headline="Chat stays free"
            features={[
              "Unlimited chat with Aura, always free",
              "Voice and circles become part of an open space",
              "Founding members keep a permanent discount",
              "Prices are shown inside your dashboard, never here",
            ]}
            cta="Start with chat"
            href="/auth/signup"
            primary={false}
          />
        </div>

        <p style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "var(--calm-ink-40)", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          Calm Therapist is a place to think out loud with support. It is not a substitute for care
          from a licensed professional, and it will always tell you when that is the right next step.
        </p>
      </div>

      <Style>{`
        @media (max-width: 760px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</Style>
    </section>
  );
}

function Card({
  title, headline, badge, features, cta, href, primary,
}: {
  title: string;
  headline: string;
  badge?: string;
  features: string[];
  cta: string;
  href: string;
  primary: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: primary ? "var(--calm-forest)" : "var(--calm-white)",
        color: primary ? "white" : "var(--calm-ink)",
        border: primary ? "1px solid var(--calm-forest)" : "1px solid var(--calm-ink-10)",
        borderRadius: 20,
        padding: 36,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {badge && (
        <span
          style={{
            position: "absolute",
            top: -12,
            left: 28,
            padding: "4px 12px",
            borderRadius: 999,
            background: "var(--calm-ink)",
            color: "white",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </span>
      )}
      <div>
        <p className="body-micro" style={{ opacity: 0.85 }}>{title}</p>
        <p style={{ fontFamily: "var(--font-heading)", fontSize: 34, fontWeight: 500, marginTop: 8, lineHeight: 1.15 }}>
          {headline}
        </p>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {features.map((f) => (
          <li key={f} style={{ fontSize: 15, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: primary ? "rgba(255,255,255,0.85)" : "var(--calm-forest)",
                marginTop: 9,
                flexShrink: 0,
              }}
            />
            {f}
          </li>
        ))}
      </ul>
      <Link href={href} className={primary ? "btn-light" : "btn-primary"} style={{ marginTop: "auto", textAlign: "center" }}>
        {cta}
      </Link>
    </div>
  );
}
