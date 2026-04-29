"use client";

import { Style } from "@/components/ui/Style";

import Link from "next/link";
import { motion } from "framer-motion";
import { FEATURE_LIST } from "@/lib/features";

export function ModeCards() {
  return (
    <section style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      <div className="container">
        <span className="micro-label" style={{ color: "var(--calm-forest)" }}>Five ways in</span>
        <h2 style={{ marginTop: 16, marginBottom: 16 }}>Five features. One conversation.</h2>
        <p className="body-large" style={{ color: "var(--calm-ink-70)", maxWidth: 640, marginBottom: 56 }}>
          Memory carries between all of them. What you said in voice shows up in your journal.
          What you wrote at 3am is there in next week&apos;s reflect.
        </p>

        <div
          className="modes-row no-scrollbar"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
          }}
        >
          {FEATURE_LIST.map((mode, i) => (
            <motion.div
              key={mode.key}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={`/features/${mode.slug}`}
                style={{
                  display: "block",
                  position: "relative",
                  background: "var(--calm-mist)",
                  border: "1px solid var(--calm-ink-10)",
                  borderRadius: 12,
                  padding: 28,
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    bottom: -20,
                    right: -8,
                    fontFamily: "var(--font-heading)",
                    fontSize: 120,
                    lineHeight: 1,
                    color: "var(--calm-forest-10)",
                    fontWeight: 500,
                    pointerEvents: "none",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
                  <h3 style={{ fontSize: 24, lineHeight: 1.2 }}>{mode.label}</h3>
                  <p style={{ marginTop: 12, fontSize: 14, color: "var(--calm-ink)", lineHeight: 1.6, flex: 1 }}>
                    {mode.oneLiner}
                  </p>
                  <span
                    className="body-micro"
                    style={{ color: "var(--calm-forest)", marginTop: 16 }}
                  >
                    Learn more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Style>{`
        @media (max-width: 960px) {
          .modes-row {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            grid-template-columns: unset !important;
            padding-bottom: 16px;
          }
          .modes-row > * {
            flex: 0 0 80%;
            scroll-snap-align: start;
          }
        }
      `}</Style>
    </section>
  );
}
