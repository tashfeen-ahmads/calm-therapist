"use client";

import { Style } from "@/components/ui/Style";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SEED_QUOTES = [
  {
    name: "Amir, 34",
    text: "I've tried three other apps. They all felt like talking to a FAQ. Calm Therapist actually remembered what I told it about my father in week one. That changed everything.",
  },
  {
    name: "Priya, 28",
    text: "The voice agent is the reason I keep coming back. I can't type when I'm anxious. But I can speak. And Calm Therapist listens without rushing me.",
  },
  {
    name: "James, 41",
    text: "I don't do therapy. I never have. But Calm Therapist doesn't feel like therapy. It feels like finally having somewhere to think out loud.",
  },
  {
    name: "Leila, 26",
    text: "I was worried about my data. I read the privacy page three times. Then I trusted it. That was six months ago. I've never looked back.",
  },
  {
    name: "Tom, 38",
    text: "The monthly reflect showed me I've had the same argument with my wife twelve times this year. Seeing that pattern written down was the most useful thing any tool has ever done for me.",
  },
  {
    name: "Sara, 31",
    text: "It asked me how my sister was doing — the one I mentioned in passing two weeks ago. A human therapist has never done that.",
  },
];

interface Quote { name: string; text: string }

export function Testimonials() {
  const [quotes, setQuotes] = useState<Quote[]>(SEED_QUOTES);

  useEffect(() => {
    fetch("/api/feedback/highlights")
      .then((r) => r.json())
      .then((data: { items?: Quote[] }) => {
        if (Array.isArray(data.items) && data.items.length > 0) {
          // Live feedback first, then top up from the seed list to reach 6.
          const merged = [...data.items, ...SEED_QUOTES].slice(0, 6);
          setQuotes(merged);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{ background: "var(--calm-mist)", padding: "120px 24px" }}>
      <div className="container">
        <div
          className="testi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.06 }}
              style={{
                background: "var(--calm-white)",
                border: "1px solid var(--calm-ink-10)",
                borderRadius: 12,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontSize: 20,
                  lineHeight: 1.5,
                  color: "var(--calm-ink)",
                }}
              >
                &ldquo;{q.text}&rdquo;
              </p>
              <div style={{ marginTop: "auto" }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{q.name}</p>
                <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: "var(--calm-forest)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Style>{`
        @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .testi-grid { grid-template-columns: 1fr !important; } }
      `}</Style>
    </section>
  );
}
