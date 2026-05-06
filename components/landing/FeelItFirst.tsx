"use client";

import { Style } from "@/components/ui/Style";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

/**
 * Pre-signup landing experience. Type one sentence, get one attuned response,
 * THEN see the soft signup CTA. No form before the first emotional hit.
 */

type Phase = "idle" | "thinking" | "answered";

export function FeelItFirst() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || phase === "thinking") return;
    setError(null);
    setReply("");
    setTier(0);
    setPhase("thinking");

    try {
      const res = await fetch("/api/feel-it", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });
      if (!res.body) throw new Error("No body");
      const t = Number(res.headers.get("X-Crisis-Tier") ?? "0");
      if (t > 0) setTier(t);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const cleaned = acc.replace(/\n?\[crisis_tier:\d+\]\n?/g, "");
        setReply(cleaned);
      }
      setPhase("answered");
    } catch {
      setError("I lost you for a second — say that again?");
      setPhase("idle");
    }
  };

  const reset = () => {
    setInput("");
    setReply("");
    setPhase("idle");
    setError(null);
    setTier(0);
    taRef.current?.focus();
  };

  return (
    <section style={{ background: "var(--calm-white)", padding: "140px 24px 80px" }}>
      <div className="container" style={{ maxWidth: 880 }}>
        <motion.span
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="micro-label micro-label-bordered"
          style={{ display: "inline-block", marginBottom: 28 }}
        >
          Backed by Implenix
        </motion.span>

        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          style={{ fontSize: 68, lineHeight: 1.05, marginBottom: 24 }}
        >
          A quiet place to think out loud.
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="body-large"
          style={{ color: "var(--calm-ink-70)", maxWidth: 640, marginBottom: 40 }}
        >
          One sentence is enough. Try it before anything else — no email, no name, no signup
          screen first. See how it feels to be heard.
        </motion.p>

        <motion.form
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          onSubmit={submit}
          className="feel-form"
        >
          <textarea
            ref={taRef}
            placeholder="What's been on your mind?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            disabled={phase === "thinking"}
            className="feel-input"
            rows={3}
            maxLength={1500}
          />
          <div className="feel-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={!input.trim() || phase === "thinking"}
              style={{ height: 48, padding: "0 28px" }}
            >
              {phase === "thinking" ? "Thinking with you…" : "Let's talk"}
            </button>
            <span style={{ fontSize: 13, color: "var(--calm-ink-40)" }}>
              No signup. One reply. Then you decide.
            </span>
          </div>
          {error && <p style={{ marginTop: 12, fontSize: 14, color: "var(--calm-ink)" }}>{error}</p>}
        </motion.form>

        {phase !== "idle" && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="feel-reply-wrap"
          >
            <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 12 }}>
              Aura, just now
            </p>
            <p className="feel-reply">
              {reply || (phase === "thinking" ? "…" : "")}
            </p>

            {phase === "answered" && tier > 0 && (
              <p
                style={{
                  marginTop: 16,
                  padding: "12px 14px",
                  background: "var(--calm-mist)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "var(--calm-ink)",
                }}
              >
                If anything you just shared feels too heavy, please consider reaching out to a
                human you trust — or a crisis line in your country. We can stay here together too.
              </p>
            )}

            {phase === "answered" && (
              <div className="feel-cta">
                <Link href="/auth/signup" className="btn-primary" style={{ height: 48, padding: "0 28px" }}>
                  Continue the conversation
                </Link>
                <button type="button" className="btn-ghost" onClick={reset}>
                  Try another thought
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Style>{`
        .feel-form {
          background: var(--calm-mist);
          border-radius: 18px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .feel-input {
          width: 100%;
          padding: 14px 16px;
          font-family: var(--font-body);
          font-size: 18px;
          line-height: 1.6;
          color: var(--calm-ink);
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-radius: 12px;
          resize: vertical;
          min-height: 96px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .feel-input:focus {
          border-color: var(--calm-forest);
        }
        .feel-input::placeholder {
          color: var(--calm-ink-40);
        }
        .feel-actions {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        .feel-reply-wrap {
          margin-top: 32px;
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-left: 3px solid var(--calm-forest);
          border-radius: 14px;
          padding: 24px;
        }
        .feel-reply {
          font-family: var(--font-heading);
          font-size: 22px;
          line-height: 1.55;
          color: var(--calm-ink);
          font-style: italic;
          white-space: pre-wrap;
        }
        .feel-cta {
          margin-top: 24px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        @media (max-width: 700px) {
          .feel-input { font-size: 16px; min-height: 110px; }
        }
      `}</Style>
    </section>
  );
}
