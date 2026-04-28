"use client";

import { useState } from "react";

const QUOTES = [
  "I keep coming back to the same thought. That I'm letting people down.",
  "Sleeping was the win. The morning didn't feel like a fight.",
  "I didn't leave the room this time. I tried.",
  "Tuesdays are still hard. But maybe slightly less hard than they were.",
];

export default function ReflectPage() {
  const [focus, setFocus] = useState("");
  return (
    <div style={{ padding: "48px 32px", maxWidth: 880, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>April</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 48 }}>
        A month, in your own words.
      </p>

      <div className="card-mist" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          What came up most
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Family", "Work", "Sleep", "Anxiety on Tuesdays"].map((t) => (
            <span key={t} className="pill" style={{ cursor: "default" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          Where you shifted
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8 }}>
          In March, you used the word &ldquo;trapped&rdquo; eight times across our sessions. In April,
          you used it twice — and both times you immediately followed it with something you were
          going to do about it. That&apos;s a real shift. Not a feeling shift. An agency shift.
          You&apos;re still in the same job, with the same sister, with the same Tuesdays. But
          you&apos;re holding it differently.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          What you said about yourself
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {QUOTES.map((q, i) => (
            <li
              key={i}
              style={{
                paddingLeft: 16,
                borderLeft: "2px solid var(--calm-forest)",
                fontFamily: "var(--font-heading)",
                fontStyle: "italic",
                fontSize: 20,
                lineHeight: 1.5,
                color: "var(--calm-ink)",
              }}
            >
              &ldquo;{q}&rdquo;
            </li>
          ))}
        </ul>
      </div>

      <div className="card-mist">
        <label className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16, display: "block" }}>
          Set focus for next month
        </label>
        <input
          className="input"
          placeholder="e.g. Talk less, walk more, sleep deeper."
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
        />
      </div>
    </div>
  );
}
