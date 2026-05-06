"use client";

import { Style } from "@/components/ui/Style";
import { motion } from "framer-motion";
import Link from "next/link";

interface ModeCard {
  key: string;
  title: string;
  body: string;
  glyph: string;
}

const MODES: ModeCard[] = [
  {
    key: "burnout",
    title: "Burnout",
    body: "For when you're still showing up while quietly running on empty. No mindfulness platitudes — actual structural reading of your week.",
    glyph: "01",
  },
  {
    key: "anxiety",
    title: "Anxiety",
    body: "For loops that won't stop. Aura names the pattern instead of feeding the reassurance — that's the part that actually changes anxiety.",
    glyph: "02",
  },
  {
    key: "relationships",
    title: "Relationships",
    body: "For partners, parents, the friends you're trying not to lose. Aura stays neutral; you do the deciding.",
    glyph: "03",
  },
  {
    key: "grief",
    title: "Grief & loss",
    body: "Slower. Quieter. No silver linings. Aura sits with you on the days you can't be alone.",
    glyph: "04",
  },
  {
    key: "new-parent",
    title: "New parent",
    body: "For the months everyone said would be magical. No feeding-choice opinions. No \"enjoy every moment.\"",
    glyph: "05",
  },
];

export function AgentModesSection() {
  return (
    <section style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
          <span className="micro-label" style={{ color: "var(--calm-forest)" }}>
            Conversation modes
          </span>
          <h2 style={{ marginTop: 16, marginBottom: 20 }}>
            Pick the room you&apos;re in.
          </h2>
          <p className="body-large" style={{ color: "var(--calm-ink-70)" }}>
            Not every conversation needs the same agent. Calm Therapist switches register, pacing,
            and challenge style based on what you&apos;re bringing in. One tap on the way in.
          </p>
        </div>

        <div className="modes-feat-grid">
          {MODES.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: (i % 5) * 0.05 }}
              className="modes-feat-card"
            >
              <span className="modes-feat-glyph">{m.glyph}</span>
              <h3 style={{ fontSize: 22, marginBottom: 10 }}>{m.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>{m.body}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/auth/signup" className="btn-primary">
            Try a mode free
          </Link>
        </div>
      </div>

      <Style>{`
        .modes-feat-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .modes-feat-card {
          position: relative;
          background: var(--calm-mist);
          border: 1px solid var(--calm-ink-10);
          border-radius: 14px;
          padding: 28px 22px;
          overflow: hidden;
          min-height: 240px;
        }
        .modes-feat-glyph {
          position: absolute;
          top: 16px;
          right: 18px;
          font-family: var(--font-heading);
          font-size: 28px;
          line-height: 1;
          color: var(--calm-forest-20);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        @media (max-width: 1100px) {
          .modes-feat-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 760px) {
          .modes-feat-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .modes-feat-grid { grid-template-columns: 1fr; }
        }
      `}</Style>
    </section>
  );
}
