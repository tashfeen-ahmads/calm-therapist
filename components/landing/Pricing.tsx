import { Style } from "@/components/ui/Style";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: 64 }}>One price. Everything included.</h2>

        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          <PriceCard
            title="Try Calm Therapist"
            price="Free"
            features={[
              "3 sessions per week",
              "Chat agent only",
              "7-day session history",
              "Crisis Safe protocol",
            ]}
            cta="Start free"
            href="/onboarding/step-1"
            primary={false}
          />
          <PriceCard
            title="Calm Therapist Pro"
            price="$19"
            priceSuffix="/month"
            yearly="or $159/year"
            badge="Most chosen"
            features={[
              "Unlimited sessions",
              "Voice + chat + journal",
              "Full longitudinal history",
              "Monthly reflect with AI analysis",
              "Crisis Safe + human handoff",
              "Export your data anytime",
            ]}
            cta="Start with Pro"
            href="/onboarding/step-1?plan=pro"
            primary
          />
        </div>
      </div>

      <Style>{`
        @media (max-width: 760px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</Style>
    </section>
  );
}

function PriceCard({
  title, price, priceSuffix, yearly, features, cta, href, primary, badge,
}: {
  title: string;
  price: string;
  priceSuffix?: string;
  yearly?: string;
  features: string[];
  cta: string;
  href: string;
  primary: boolean;
  badge?: string;
}) {
  return (
    <div
      style={{
        background: primary ? "var(--calm-forest)" : "var(--calm-white)",
        color: primary ? "white" : "var(--calm-ink)",
        border: primary ? "1px solid var(--calm-forest)" : "1px solid var(--calm-ink-10)",
        borderRadius: 16,
        padding: 40,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {badge && (
        <span
          style={{
            position: "absolute",
            top: -12,
            left: 24,
            background: "var(--calm-ink)",
            color: "white",
            padding: "4px 12px",
            borderRadius: 999,
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
        <h3 style={{ color: primary ? "white" : "var(--calm-ink)", marginBottom: 12 }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 56,
              fontWeight: 500,
              color: primary ? "white" : "var(--calm-ink)",
            }}
          >
            {price}
          </span>
          {priceSuffix && (
            <span style={{ fontSize: 16, color: primary ? "rgba(255,255,255,0.7)" : "var(--calm-ink-40)" }}>
              {priceSuffix}
            </span>
          )}
        </div>
        {yearly && (
          <p style={{ fontSize: 13, marginTop: 4, color: primary ? "rgba(255,255,255,0.7)" : "var(--calm-ink-40)" }}>
            {yearly}
          </p>
        )}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {features.map((f) => (
          <li key={f} style={{ fontSize: 15, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span
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

      <Link
        href={href}
        className={primary ? "btn-light" : "btn-primary"}
        style={{ marginTop: 8 }}
      >
        {cta}
      </Link>
    </div>
  );
}
