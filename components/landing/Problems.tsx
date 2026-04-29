"use client";

import { Style } from "@/components/ui/Style";

import { motion } from "framer-motion";

const PROBLEMS = [
  ["No memory between sessions", "You repeat your story every time. We never forget."],
  ["Dangerous crisis responses", "Other bots fail when you're most vulnerable. We escalate safely."],
  ["Hollow, scripted empathy", "You can hear when it's fake. Calm Therapist is trained differently."],
  ["Your trauma sold as data", "Zero training on your conversations. Your pain is not a product."],
  ["Built only for Western users", "Culturally aware, multilingual, and built for the whole world."],
  ["No clinical accountability", "Backed by evidence-based frameworks. Not just vibes."],
  ["Men can't use it comfortably", "No therapy language. No judgment. Just clarity."],
  ["Only handles mild stress", "From everyday anxiety to deep grief, Calm Therapist stays with you."],
  ["No path back after recovery", "Monthly journals and check-ins bring you back when you need it."],
  ["AI with no human backup", "Crisis mode connects you to a real person within minutes."],
  ["Developing world ignored", "Built for South Asia, MENA, Africa, LatAm from day one."],
  ["Reactive, never proactive", "Calm Therapist tracks your patterns and reaches out before a dip becomes a crisis."],
];

export function Problems() {
  return (
    <section
      style={{ background: "var(--calm-mist)", padding: "120px 24px" }}
      className="section-mist"
    >
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 72px" }}>
          <h2>Every other tool forgets you exist.</h2>
          <p
            className="body-large"
            style={{ marginTop: 24, color: "var(--calm-ink-40)" }}
          >
            We mapped 12 documented failures across every major AI therapy product. Then we built
            Calm Therapist to solve each one.
          </p>
        </div>

        <div
          className="problems-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {PROBLEMS.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: (i % 3) * 0.05 }}
              style={{
                background: "var(--calm-white)",
                border: "1px solid var(--calm-ink-10)",
                borderRadius: 12,
                padding: 28,
              }}
            >
              <span className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16, display: "block" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{title}</p>
              <p style={{ fontSize: 14, color: "var(--calm-ink-40)", lineHeight: 1.6 }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Style>{`
        @media (max-width: 960px) {
          .problems-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .problems-grid { grid-template-columns: 1fr !important; }
        }
      `}</Style>
    </section>
  );
}
