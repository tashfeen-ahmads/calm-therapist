"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  const fadeUp = {
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <section
      style={{
        background: "var(--calm-white)",
        padding: "160px 24px 80px",
        position: "relative",
      }}
    >
      <div className="container">
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <motion.span
              {...fadeUp}
              className="micro-label micro-label-bordered"
              style={{ display: "inline-block", marginBottom: 32 }}
            >
              Backed by Implenix
            </motion.span>

            <motion.h1 {...fadeUp} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}>
              The space where you don&apos;t have to explain yourself twice.
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="body-large"
              style={{ marginTop: 32, color: "var(--calm-ink)", maxWidth: 620 }}
            >
              Calm Therapist remembers who you are. Every session builds on the last. Whether you
              need to talk, voice it out, or just write — your AI therapist adapts to you, not the
              other way around.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}
            >
              <Link href="/onboarding/step-1" className="btn-primary">
                Begin your first session
              </Link>
              <Link href="/how-it-works" className="btn-ghost">
                See how it works
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              className="hero-stats"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 24,
                marginTop: 64,
                paddingTop: 32,
                borderTop: "1px solid var(--calm-ink-10)",
              }}
            >
              <Stat label="12 gaps in existing AI therapy, solved." />
              <Stat label="Voice + text + journal in one place." />
              <Stat label="Your data never leaves your control." />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="hero-preview"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-stats { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
}

function Stat({ label }: { label: string }) {
  return (
    <p style={{ fontSize: 14, color: "var(--calm-ink-40)", lineHeight: 1.5 }}>
      {label}
    </p>
  );
}
