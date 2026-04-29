"use client";

import { Style } from "@/components/ui/Style";
import { motion } from "framer-motion";

interface Pair {
  number: string;
  problemTitle: string;
  problemBody: string;
  answerTitle: string;
  answerBody: string;
}

const PAIRS: Pair[] = [
  {
    number: "01",
    problemTitle: "It forgets you exist.",
    problemBody:
      "Every other AI therapy product starts each session from zero. You repeat your story until you can't.",
    answerTitle: "Calm Therapist remembers.",
    answerBody:
      "Names, dates, the dreams you mentioned in passing. Memory is the architecture, not a feature.",
  },
  {
    number: "02",
    problemTitle: "It fails when it matters.",
    problemBody:
      "Other bots have given dangerous responses to people in crisis — or ignored the signal entirely.",
    answerTitle: "Crisis Safe activates automatically.",
    answerBody:
      "Rule-based detection. Verified resources for your region. Stays with you while you decide to reach out.",
  },
  {
    number: "03",
    problemTitle: "Empathy as a script.",
    problemBody:
      "“That sounds really hard.” “I hear you.” Patterned reassurance you can hear from the second sentence.",
    answerTitle: "Empathy through specificity.",
    answerBody:
      "Calm Therapist references what you actually said — not a comfort script. Tone calibrated to you.",
  },
  {
    number: "04",
    problemTitle: "Your pain becomes training data.",
    problemBody:
      "Most AI therapy products use your conversations to improve their models. Your worst day is their input.",
    answerTitle: "Zero training on you.",
    answerBody:
      "We do not train on your messages. Sessions are encrypted. Export or delete everything in one click.",
  },
  {
    number: "05",
    problemTitle: "Built for one kind of user.",
    problemBody:
      "English-first. Therapy-vocabulary-first. Western-frame-first. Most of the world is left out.",
    answerTitle: "Built across cultures and languages.",
    answerBody:
      "English, Arabic, Urdu, Hindi, French, Spanish at launch. Tone presets so men don't have to translate themselves.",
  },
  {
    number: "06",
    problemTitle: "No path back after recovery.",
    problemBody:
      "Tools optimise for daily-active-users with streaks and shame. Coming back after a hard week feels like failure.",
    answerTitle: "No streaks. No shame.",
    answerBody:
      "Calm Therapist holds your record across the gaps. The Monthly Reflect surfaces shifts you'd never see alone.",
  },
];

export function Problems() {
  return (
    <section style={{ background: "var(--calm-mist)", padding: "120px 24px" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 72px" }}>
          <span className="micro-label" style={{ color: "var(--calm-forest)" }}>
            What we fixed
          </span>
          <h2 style={{ marginTop: 16, marginBottom: 24 }}>
            Six places every other tool fails. We fixed each one.
          </h2>
          <p className="body-large" style={{ color: "var(--calm-ink-70)" }}>
            We mapped the documented failures across every major AI therapy product. Then we
            redesigned around them.
          </p>
        </div>

        <div className="problems-list">
          {PAIRS.map((pair, i) => (
            <motion.div
              key={pair.number}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
              className="problem-pair"
            >
              <div className="problem-number">{pair.number}</div>

              <div className="problem-side problem-broken">
                <span className="problem-tag">The problem</span>
                <h3>{pair.problemTitle}</h3>
                <p>{pair.problemBody}</p>
              </div>

              <div className="problem-arrow" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </div>

              <div className="problem-side problem-answer">
                <span className="problem-tag">Calm Therapist</span>
                <h3>{pair.answerTitle}</h3>
                <p>{pair.answerBody}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Style>{`
        .problems-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .problem-pair {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          gap: 20px;
          align-items: stretch;
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-radius: 16px;
          padding: 28px 32px 28px 56px;
          overflow: hidden;
        }
        .problem-number {
          position: absolute;
          top: 12px;
          left: 16px;
          font-family: var(--font-heading);
          font-size: 22px;
          color: var(--calm-forest);
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .problem-side {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .problem-tag {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .problem-broken .problem-tag { color: var(--calm-ink-40); }
        .problem-answer .problem-tag { color: var(--calm-forest); }
        .problem-side h3 {
          font-size: 22px;
          line-height: 1.25;
          color: var(--calm-ink);
        }
        .problem-broken h3 { color: var(--calm-ink-70); }
        .problem-side p {
          font-size: 15px;
          line-height: 1.7;
          color: var(--calm-ink-70);
        }
        .problem-answer p { color: var(--calm-ink); }
        .problem-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--calm-forest);
        }
        @media (max-width: 760px) {
          .problem-pair {
            grid-template-columns: 1fr;
            padding: 48px 24px 24px;
            gap: 12px;
          }
          .problem-arrow { transform: rotate(90deg); justify-content: flex-start; padding-left: 4px; }
        }
      `}</Style>
    </section>
  );
}
