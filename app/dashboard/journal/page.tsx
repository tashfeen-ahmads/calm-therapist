"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MOOD = [3, 2, 4, 3, null, 4, null];

const ANALYSIS = [
  "You used the word \"heavy\" three times this week — Monday, Wednesday, and Sunday. Each time it followed a call with your sister. The pattern is consistent enough that it's worth naming.",
  "Tuesday was hard, as it's been for the last four weeks. But on Wednesday — the day you took the longer walk — you described feeling \"settled\" for the first time this month. That's a real signal, not a coincidence.",
  "Notice what you didn't say this week: anything about your father. Three weeks ago you spoke about him every other session. The grief hasn't gone — it's moved. That deserves your attention, not your judgment.",
];

export default function JournalPage() {
  const [content, setContent] = useState(
    "Wednesday felt different. I walked after dinner — first time in maybe two weeks. Slept through the night. The morning didn't feel like a fight."
  );

  return (
    <div style={{ padding: "48px 32px", maxWidth: 880, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Weekly Journal</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 40 }}>
        Week of {weekRange()}
      </p>

      <div className="card-mist" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          This week
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {DAYS.map((d, i) => (
            <div key={d} style={{ flex: 1, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "var(--calm-ink-40)", marginBottom: 8 }}>{d}</p>
              <div
                style={{
                  width: 12,
                  height: 12,
                  margin: "0 auto",
                  borderRadius: 999,
                  background:
                    MOOD[i] === null
                      ? "var(--calm-ink-10)"
                      : MOOD[i]! >= 4
                      ? "var(--calm-forest)"
                      : MOOD[i]! >= 3
                      ? "var(--calm-forest-20)"
                      : "var(--calm-ink-40)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          Your entry
        </p>
        <textarea
          className="input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          style={{ resize: "vertical", lineHeight: 1.7 }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn-ghost" style={{ height: 36, fontSize: 13 }}>Bold</button>
          <button className="btn-ghost" style={{ height: 36, fontSize: 13 }}>Italic</button>
          <button className="btn-ghost" style={{ height: 36, fontSize: 13 }}>List</button>
        </div>
      </div>

      <div className="card-mist" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <p className="body-micro" style={{ color: "var(--calm-forest)" }}>
            What Calm Therapist noticed this week
          </p>
          <button className="btn-ghost" style={{ height: 32, fontSize: 12 }}>Regenerate</button>
        </div>
        {ANALYSIS.map((p, i) => (
          <p key={i} style={{ fontSize: 16, lineHeight: 1.8, marginBottom: i < ANALYSIS.length - 1 ? 16 : 0 }}>
            {p}
          </p>
        ))}
      </div>

      <button className="btn-ghost">Export this week as PDF</button>
    </div>
  );
}

function weekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${monday.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${sunday.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
