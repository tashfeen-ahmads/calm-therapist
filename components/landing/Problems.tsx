"use client";

import { Style } from "@/components/ui/Style";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

interface Pair {
  number: string;
  visualKind: VisualKind;
  problemTitle: string;
  problemBody: string;
  answerTitle: string;
  answerBody: string;
}

type VisualKind = "memory" | "crisis" | "empathy" | "data" | "culture" | "streak";

const PAIRS: Pair[] = [
  {
    number: "01",
    visualKind: "memory",
    problemTitle: "It forgets you exist.",
    problemBody:
      "Every other AI therapy product starts each session from zero. You repeat your story until you can't.",
    answerTitle: "Calm Therapist remembers.",
    answerBody:
      "Names, dates, the dreams you mentioned in passing. Memory is the architecture, not a feature.",
  },
  {
    number: "02",
    visualKind: "crisis",
    problemTitle: "It fails when it matters.",
    problemBody:
      "Other bots have given dangerous responses to people in crisis — or ignored the signal entirely.",
    answerTitle: "Crisis Safe activates automatically.",
    answerBody:
      "Rule-based detection. Verified resources for your region. Stays with you while you decide to reach out.",
  },
  {
    number: "03",
    visualKind: "empathy",
    problemTitle: "Empathy as a script.",
    problemBody:
      "“That sounds really hard.” “I hear you.” Patterned reassurance you can hear from the second sentence.",
    answerTitle: "Empathy through specificity.",
    answerBody:
      "Calm Therapist references what you actually said — not a comfort script. Tone calibrated to you.",
  },
  {
    number: "04",
    visualKind: "data",
    problemTitle: "Your pain becomes training data.",
    problemBody:
      "Most AI therapy products use your conversations to improve their models. Your worst day is their input.",
    answerTitle: "Zero training on you.",
    answerBody:
      "We do not train on your messages. Sessions are encrypted. Export or delete everything in one click.",
  },
  {
    number: "05",
    visualKind: "culture",
    problemTitle: "Built for one kind of user.",
    problemBody:
      "English-first. Therapy-vocabulary-first. Western-frame-first. Most of the world is left out.",
    answerTitle: "Built across cultures and languages.",
    answerBody:
      "English, Arabic, Urdu, Hindi, French, Spanish at launch. Tone presets so men don't have to translate themselves.",
  },
  {
    number: "06",
    visualKind: "streak",
    problemTitle: "No path back after recovery.",
    problemBody:
      "Tools optimise for daily-active-users with streaks and shame. Coming back after a hard week feels like failure.",
    answerTitle: "No streaks. No shame.",
    answerBody:
      "Calm Therapist holds your record across the gaps. The Monthly Reflect surfaces shifts you'd never see alone.",
  },
];

export function Problems() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map progress → index. Skip the leading 0..0.05 so the first pair holds at top.
  const indexProgress = useTransform(scrollYProgress, [0.04, 0.96], [0, PAIRS.length - 0.0001]);

  useMotionValueEvent(indexProgress, "change", (v) => {
    const i = Math.max(0, Math.min(PAIRS.length - 1, Math.floor(v)));
    if (i !== activeIdx) setActiveIdx(i);
  });

  // Animated progress bar fill (0..1).
  const barFill = useTransform(scrollYProgress, [0.04, 0.96], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="problems-section"
      style={{
        background: "var(--calm-mist)",
        position: "relative",
      }}
    >
      <div className="problems-sticky">
        <div className="container">
          <div className="problems-header">
            <span className="micro-label" style={{ color: "var(--calm-forest)" }}>
              What we fixed
            </span>
            <h2 style={{ marginTop: 12 }}>
              Six places every other tool fails.
              <br />
              We fixed each one.
            </h2>
          </div>

          <div className="problems-stage">
            <div className="problems-visual" aria-hidden>
              {PAIRS.map((p, i) => (
                <Visual key={p.number} kind={p.visualKind} active={i === activeIdx} />
              ))}
            </div>

            <div className="problems-copy">
              <div className="problems-counter">
                <span className="problems-counter-num">{PAIRS[activeIdx].number}</span>
                <span className="problems-counter-of">/ {String(PAIRS.length).padStart(2, "0")}</span>
              </div>

              <div className="problems-copy-stack">
                {PAIRS.map((pair, i) => (
                  <motion.div
                    key={pair.number}
                    initial={false}
                    animate={{
                      opacity: i === activeIdx ? 1 : 0,
                      y: i === activeIdx ? 0 : 12,
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    style={{ pointerEvents: i === activeIdx ? "auto" : "none" }}
                    className="problems-copy-pair"
                  >
                    <div className="problems-copy-row problems-broken">
                      <span className="problems-tag">The problem</span>
                      <h3>{pair.problemTitle}</h3>
                      <p>{pair.problemBody}</p>
                    </div>

                    <div className="problems-divider">
                      <span className="problems-divider-line" />
                      <span className="problems-divider-arrow" aria-hidden>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M12 5v14" />
                          <path d="M6 13l6 6 6-6" />
                        </svg>
                      </span>
                    </div>

                    <div className="problems-copy-row problems-answer">
                      <span className="problems-tag">Calm Therapist</span>
                      <h3>{pair.answerTitle}</h3>
                      <p>{pair.answerBody}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="problems-progress">
            <motion.div className="problems-progress-fill" style={{ width: barFill }} />
            <div className="problems-progress-dots">
              {PAIRS.map((p, i) => (
                <span
                  key={p.number}
                  className="problems-progress-dot"
                  data-active={i === activeIdx ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Style>{`
        .problems-section {
          height: ${PAIRS.length * 75}vh;
        }
        .problems-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          padding: 64px 24px;
        }
        .problems-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 48px;
        }
        .problems-header h2 {
          font-size: 44px;
          line-height: 1.1;
        }

        .problems-stage {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 64px;
          align-items: center;
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-radius: 24px;
          padding: 48px 56px;
          min-height: 360px;
        }
        .problems-visual {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
          max-width: 360px;
          border-radius: 20px;
          background: var(--calm-mist);
          overflow: hidden;
        }

        .problems-copy {
          position: relative;
        }
        .problems-counter {
          display: flex;
          align-items: baseline;
          gap: 6px;
          font-family: var(--font-heading);
          color: var(--calm-forest);
          margin-bottom: 24px;
        }
        .problems-counter-num {
          font-size: 56px;
          line-height: 1;
          font-weight: 500;
        }
        .problems-counter-of {
          font-size: 16px;
          color: var(--calm-ink-40);
        }

        .problems-copy-stack {
          position: relative;
          min-height: 280px;
        }
        .problems-copy-pair {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .problems-tag {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .problems-broken .problems-tag { color: var(--calm-ink-40); }
        .problems-answer .problems-tag { color: var(--calm-forest); }
        .problems-broken h3 {
          font-size: 26px;
          line-height: 1.25;
          color: var(--calm-ink-70);
          margin-top: 6px;
        }
        .problems-answer h3 {
          font-size: 28px;
          line-height: 1.2;
          color: var(--calm-ink);
          margin-top: 6px;
        }
        .problems-broken p {
          font-size: 15px;
          line-height: 1.65;
          color: var(--calm-ink-70);
          margin-top: 6px;
        }
        .problems-answer p {
          font-size: 15px;
          line-height: 1.65;
          color: var(--calm-ink);
          margin-top: 6px;
        }
        .problems-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--calm-forest);
          margin: 4px 0;
        }
        .problems-divider-line {
          flex: 1;
          height: 1px;
          background: var(--calm-forest-20);
        }
        .problems-divider-arrow {
          display: inline-flex;
        }

        .problems-progress {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .problems-progress-fill {
          height: 2px;
          background: var(--calm-forest);
          flex: 1;
          border-radius: 999px;
          max-width: none;
        }
        .problems-progress::before {
          content: "";
          position: absolute;
          height: 2px;
          background: var(--calm-ink-10);
          width: calc(100% - 96px);
          z-index: -1;
        }
        .problems-progress-dots {
          display: flex;
          gap: 8px;
        }
        .problems-progress-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--calm-ink-10);
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .problems-progress-dot[data-active="true"] {
          background: var(--calm-forest);
          transform: scale(1.3);
        }

        @media (max-width: 900px) {
          .problems-section { height: auto; }
          .problems-sticky {
            position: relative;
            top: auto;
            height: auto;
            padding: 80px 16px;
          }
          .problems-stage {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 28px;
          }
          .problems-visual {
            max-width: 220px;
            margin: 0 auto;
          }
          .problems-copy-stack { min-height: auto; }
          .problems-copy-pair { position: relative; }
          .problems-copy-pair[style*="opacity: 0"] { display: none; }
        }
      `}</Style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Visuals — one per pair. Pure SVG, animated when active.            */
/* ------------------------------------------------------------------ */

function Visual({ kind, active }: { kind: VisualKind; active: boolean }) {
  const wrapStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: active ? 1 : 0,
    transition: "opacity 0.45s ease",
  };
  return (
    <div style={wrapStyle}>
      {kind === "memory" && <MemoryVisual active={active} />}
      {kind === "crisis" && <CrisisVisual active={active} />}
      {kind === "empathy" && <EmpathyVisual active={active} />}
      {kind === "data" && <DataVisual active={active} />}
      {kind === "culture" && <CultureVisual active={active} />}
      {kind === "streak" && <StreakVisual active={active} />}
    </div>
  );
}

const FOREST = "var(--calm-forest)";
const FOREST_20 = "var(--calm-forest-20)";
const INK_10 = "var(--calm-ink-10)";

function MemoryVisual({ active }: { active: boolean }) {
  // A network of memory nodes connecting; one node fades in last.
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      {/* Connecting lines */}
      {LINES.map((l, i) => (
        <motion.line
          key={i}
          x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}
          stroke={FOREST_20}
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.1 + i * 0.06, ease: "easeOut" }}
        />
      ))}
      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n[0]}
          cy={n[1]}
          r="6"
          fill={i === 4 ? FOREST : "white"}
          stroke={FOREST}
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          style={{ transformOrigin: `${n[0]}px ${n[1]}px` }}
        />
      ))}
    </svg>
  );
}
const NODES: [number, number][] = [
  [60, 60], [180, 80], [120, 50], [80, 140], [180, 160], [60, 200], [200, 200], [120, 180],
];
const LINES: [number, number, number, number][] = [
  [60, 60, 120, 50], [120, 50, 180, 80], [60, 60, 80, 140], [180, 80, 180, 160],
  [80, 140, 120, 180], [180, 160, 200, 200], [120, 180, 60, 200], [80, 140, 180, 160],
];

function CrisisVisual({ active }: { active: boolean }) {
  // Concentric "shield" rings pulsing inward, with a forest core.
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      {[100, 76, 52].map((r, i) => (
        <motion.circle
          key={i}
          cx="120" cy="120" r={r}
          stroke={FOREST}
          strokeWidth="1.2"
          fill="none"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{
            scale: active ? [0.85, 1, 0.95] : 0.6,
            opacity: active ? [0, 0.4, 0.2] : 0,
          }}
          transition={{
            duration: 2.4,
            repeat: active ? Infinity : 0,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "120px 120px" }}
        />
      ))}
      <motion.path
        d="M120 88 L120 120 M120 132 L120 134"
        stroke={FOREST}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <motion.circle
        cx="120" cy="120" r="28"
        fill={FOREST_20}
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: "120px 120px" }}
      />
    </svg>
  );
}

function EmpathyVisual({ active }: { active: boolean }) {
  // Three scribbled lines that resolve into one clean handwritten line.
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      {[80, 110, 140].map((y, i) => (
        <motion.path
          key={i}
          d={`M 40 ${y} Q 80 ${y - 8 + i * 4}, 120 ${y} T 200 ${y}`}
          stroke={i === 1 ? FOREST : INK_10}
          strokeWidth={i === 1 ? "2" : "1"}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 1.2, delay: i * 0.18, ease: "easeOut" }}
        />
      ))}
      <motion.path
        d="M 60 170 Q 120 150, 180 170"
        stroke={FOREST}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

function DataVisual({ active }: { active: boolean }) {
  // A vault. Closed lock with chain-like outer ring.
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <motion.circle
        cx="120" cy="120" r="84"
        stroke={FOREST_20}
        strokeWidth="2"
        strokeDasharray="4 8"
        fill="none"
        initial={{ rotate: 0 }}
        animate={{ rotate: active ? 360 : 0 }}
        transition={{ duration: 14, repeat: active ? Infinity : 0, ease: "linear" }}
        style={{ transformOrigin: "120px 120px" }}
      />
      <motion.rect
        x="84" y="110" width="72" height="56" rx="8"
        fill="white"
        stroke={FOREST}
        strokeWidth="2"
        initial={{ y: 130, opacity: 0 }}
        animate={{ y: active ? 110 : 130, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <motion.path
        d="M 100 110 V 96 a 20 20 0 0 1 40 0 V 110"
        stroke={FOREST}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      />
      <motion.circle
        cx="120" cy="138" r="4"
        fill={FOREST}
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
    </svg>
  );
}

function CultureVisual({ active }: { active: boolean }) {
  // A globe-like grid of dots, with a few highlighted.
  const dots: [number, number][] = [];
  for (let r = 60; r <= 160; r += 20) {
    for (let c = 60; c <= 180; c += 20) {
      dots.push([c, r]);
    }
  }
  const highlights = [3, 7, 12, 18, 22, 28];
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <motion.circle
        cx="120" cy="120" r="98"
        stroke={FOREST_20}
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ transformOrigin: "120px 120px" }}
      />
      {dots.map((d, i) => (
        <motion.circle
          key={i}
          cx={d[0]} cy={d[1]} r="2.5"
          fill={highlights.includes(i) ? FOREST : "var(--calm-ink-30)"}
          initial={{ scale: 0 }}
          animate={{ scale: active ? 1 : 0 }}
          transition={{
            duration: 0.4,
            delay: 0.05 * (i % 8),
            ease: "easeOut",
          }}
          style={{ transformOrigin: `${d[0]}px ${d[1]}px` }}
        />
      ))}
    </svg>
  );
}

function StreakVisual({ active }: { active: boolean }) {
  // A line that breaks (gap), with a parallel continuous line below it.
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <motion.path
        d="M 36 96 L 80 96 M 100 96 L 156 96 M 176 96 L 204 96"
        stroke="var(--calm-ink-30)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.text
        x="120" y="80"
        textAnchor="middle"
        fill="var(--calm-ink-40)"
        style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
      >
        Their streak
      </motion.text>
      <motion.path
        d="M 36 152 Q 80 130, 120 152 T 204 152"
        stroke={FOREST}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
      />
      <motion.text
        x="120" y="184"
        textAnchor="middle"
        fill={FOREST}
        style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.45, delay: 0.7 }}
      >
        Your record
      </motion.text>
    </svg>
  );
}
