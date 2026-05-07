import { Style } from "@/components/ui/Style";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
          <span className="micro-label" style={{ color: "var(--calm-forest)" }}>Keep your space open</span>
          <h2 style={{ marginTop: 16, marginBottom: 16 }}>Two ways to stay.</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-70)" }}>
            Try a few conversations on us. If it feels useful, keep your space open. You can pause
            anytime — coming back is the point, not the payment.
          </p>
        </div>

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
            title="Just exploring"
            price="Free"
            features={[
              "Three conversations a week",
              "Text together, anytime",
              "We hold the last seven days",
              "Crisis-aware from message one",
            ]}
            cta="Open your space"
            href="/auth/signup"
            primary={false}
          />
          <PriceCard
            title="Keep your space open"
            price="$19"
            priceSuffix="/month"
            yearly="or $149/year — pause whenever"
            badge="Most chosen"
            features={[
              "As many conversations as you need",
              "Talk or type, your call",
              "Your full record, kept for you",
              "Monthly look-back, in your own words",
              "Crisis-safe with a real human, fast",
              "Take your data with you, any time",
            ]}
            cta="Keep my space open"
            href="/auth/signup?next=%2Fdashboard%26plan=pro"
            primary
          />
        </div>

        <p style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "var(--calm-ink-40)" }}>
          You can pause your space instead of cancelling. Coming back is welcome.
        </p>
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
