"use client";

import { Style } from "@/components/ui/Style";

import Link from "next/link";
import { motion } from "framer-motion";

export function DeepDive() {
  return (
    <section style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: 80, maxWidth: 760, margin: "0 auto 80px" }}>
          Built around how your mind actually works.
        </h2>

        <Row
          imageLeft
          visual={<VoiceVisual />}
          title="Voice Agent"
          body="The Voice Agent picks up emotional cadence, not just words. It pauses where you'd want a person to pause. It never asks you to repeat yourself, never forgets your name, and never uses scripted prompts. When you can't type, you can speak."
          href="/features/voice"
        />
        <Row
          imageLeft={false}
          visual={<JournalVisual />}
          title="Weekly Journal + Monthly Reflect"
          body="Writing changes how you metabolize what happened. Calm Therapist holds the longitudinal record — what you said three weeks ago, the patterns you didn't see, the words you used yourself. Then it shows you, gently."
          href="/features/journal"
        />
        <Row
          imageLeft
          visual={<ProfileVisual />}
          title="Your profile, your history, your words"
          body="Every session is yours. Searchable, downloadable, and deletable. No one but you ever sees it. Calm Therapist's job is to help you understand yourself — not to keep your data."
          href="/dashboard"
        />
      </div>
    </section>
  );
}

function Row({
  imageLeft, visual, title, body, href,
}: {
  imageLeft: boolean; visual: React.ReactNode; title: string; body: string; href: string;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="deep-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        alignItems: "center",
        padding: "48px 0",
        borderTop: "1px solid var(--calm-ink-10)",
      }}
    >
      <div style={{ order: imageLeft ? 0 : 1 }}>{visual}</div>
      <div>
        <h3>{title}</h3>
        <p className="body-large" style={{ marginTop: 16, color: "var(--calm-ink)" }}>{body}</p>
        <Link
          href={href}
          className="micro-label"
          style={{ marginTop: 24, display: "inline-block", color: "var(--calm-forest)" }}
        >
          Explore →
        </Link>
      </div>

      <Style>{`
        @media (max-width: 800px) {
          .deep-row { grid-template-columns: 1fr !important; gap: 32px !important; }
          .deep-row > *:first-child { order: 0 !important; }
        }
      `}</Style>
    </motion.div>
  );
}

function VoiceVisual() {
  return (
    <div
      style={{
        background: "var(--calm-mist)",
        borderRadius: 16,
        padding: 48,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "5 / 4",
      }}
    >
      <div className="voice-waveform listening">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="ring-core" />
      </div>
      <p className="body-micro" style={{ marginTop: 32, color: "var(--calm-ink-40)" }}>
        Calm Therapist is listening
      </p>
    </div>
  );
}

function JournalVisual() {
  return (
    <div
      style={{
        background: "var(--calm-mist)",
        borderRadius: 16,
        padding: 32,
        aspectRatio: "5 / 4",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Week of April 21</p>
      <h4>What Calm Therapist noticed</h4>
      <p style={{ fontSize: 14, color: "var(--calm-ink)", lineHeight: 1.6 }}>
        You used the word &ldquo;heavy&rdquo; in three sessions this week — Monday, Wednesday, and
        Sunday. Each time, after a call with your sister.
      </p>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          gap: 8,
          paddingTop: 12,
          borderTop: "1px solid rgba(45,45,45,0.1)",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
          <div
            key={d}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              background: d === 3 || d === 7 ? "var(--calm-forest)" : "rgba(45,45,45,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ProfileVisual() {
  return (
    <div
      style={{
        background: "var(--calm-white)",
        border: "1px solid var(--calm-ink-10)",
        borderRadius: 16,
        padding: 28,
        aspectRatio: "5 / 4",
      }}
    >
      <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>
        Your profile
      </p>
      <h4 style={{ marginBottom: 16 }}>What Calm Therapist knows about you</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          "Your father passed away in March.",
          "You sleep best after evening walks.",
          "Tuesdays are your hardest day.",
          "Your sister is going through a divorce.",
        ].map((s) => (
          <li
            key={s}
            style={{
              fontSize: 14,
              padding: "10px 12px",
              background: "var(--calm-mist)",
              borderRadius: 8,
              color: "var(--calm-ink)",
            }}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
