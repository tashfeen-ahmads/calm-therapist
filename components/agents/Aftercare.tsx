"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface Props {
  name?: string;
  /** A summary line Aura wrote about the conversation. Optional. */
  reflection?: string;
  /** One reflection prompt to leave the user with. Optional. */
  prompt?: string;
  onClose?: () => void;
}

const DEFAULT_REFLECTION =
  "We covered a lot. Whatever sat heavy in your chest when you started — it's a little smaller now.";
const DEFAULT_PROMPT =
  "Sometime today, see if you can name out loud one thing you wanted to say but didn't.";

export function Aftercare({ name, reflection, prompt, onClose }: Props) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    try {
      const key = "calm-therapist:aftercare-notes";
      const existing = JSON.parse(window.localStorage.getItem(key) ?? "[]") as { at: string; note: string }[];
      existing.push({ at: new Date().toISOString(), note });
      window.localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>
          After-care
        </p>
        <h2 style={{ marginBottom: 16 }}>
          Thank you for showing up{name ? `, ${name}` : ""}.
        </h2>
        <p className="body-large" style={{ color: "var(--calm-ink-70)", lineHeight: 1.7 }}>
          {reflection ?? DEFAULT_REFLECTION}
        </p>
      </div>

      <div
        style={{
          background: "var(--calm-mist)",
          borderRadius: 14,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.5,
            color: "var(--calm-ink)",
          }}
        >
          &ldquo;{prompt ?? DEFAULT_PROMPT}&rdquo;
        </p>
        <p style={{ fontSize: 13, color: "var(--calm-ink-40)" }}>
          A small thing for you to carry until next time. No pressure to do anything.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
          A note for tomorrow you (private)
        </span>
        <textarea
          className="input"
          placeholder="One sentence. Nothing fancy."
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ resize: "vertical" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={save}
            disabled={!note.trim() || saved}
            className="btn-ghost"
            style={{ height: 36, fontSize: 13 }}
          >
            {saved ? "Saved" : "Save it"}
          </button>
        </div>
      </div>

      <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--calm-ink)" }}>
        I&apos;ll be here when you need me. No streak. No guilt. Coming back is welcome.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="button" onClick={onClose} className="btn-primary">
          Back to your space
        </button>
        <Link href="/dashboard/journal" className="btn-ghost">
          Open this week&apos;s journal
        </Link>
      </div>
    </motion.div>
  );
}
