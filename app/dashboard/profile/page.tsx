"use client";

import { useEffect, useState } from "react";
import { loadMemories, MemoryNode } from "@/lib/memory";
import { readState } from "@/components/onboarding/OnboardingShell";

const SESSION_HISTORY = [
  { date: "Apr 26", mode: "Voice", duration: "22 min", summary: "The same argument with your wife came up. You stayed, this time." },
  { date: "Apr 24", mode: "Chat", duration: "18 min", summary: "Sleep is improving on the nights you walk." },
  { date: "Apr 22", mode: "Voice", duration: "31 min", summary: "Tuesdays again. You named the trigger more directly." },
  { date: "Apr 19", mode: "Chat", duration: "14 min", summary: "Your sister called. You let her finish before responding." },
  { date: "Apr 16", mode: "Voice", duration: "27 min", summary: "Work is loud. You haven't spoken to your manager." },
  { date: "Apr 14", mode: "Journal", duration: "—", summary: "Wrote about your father for the first time in three weeks." },
];

const MOOD_DATA = [3, 2, 3, 4, 2, 3, 3, 4, 3, 2, 4, 4, 3, 4, 4, 3, 3, 4, 4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4];

export default function ProfilePage() {
  const [name, setName] = useState("friend");
  const [age, setAge] = useState("—");
  const [tone, setTone] = useState("warm");
  const [language, setLanguage] = useState("en");
  const [memories, setMemories] = useState<MemoryNode[]>([]);

  useEffect(() => {
    const s = readState() as Record<string, string>;
    if (s.name) setName(s.name);
    if (s.age) setAge(s.age);
    if (s.tone) setTone(s.tone);
    if (s.language) setLanguage(s.language);
    setMemories(loadMemories());
  }, []);

  return (
    <div style={{ padding: "48px 32px", maxWidth: 980, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 32 }}>Your profile</h2>

      <div className="card" style={{ marginBottom: 32 }}>
        <ProfileRow label="Name" value={name} />
        <ProfileRow label="Age" value={age} />
        <ProfileRow label="Tone" value={capitalize(tone)} />
        <ProfileRow label="Language" value={languageLabel(language)} />
        <ProfileRow label="Member since" value="February 2026" last />
      </div>

      <div className="card-mist" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          What Calm Therapist knows about you
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {memories.map((m) => (
            <li
              key={m.id}
              style={{
                background: "var(--calm-white)",
                border: "1px solid var(--calm-ink-10)",
                padding: "14px 18px",
                borderRadius: 10,
                fontSize: 15,
                lineHeight: 1.6,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span>{m.statement}</span>
              <span style={{ fontSize: 12, color: "var(--calm-ink-40)" }}>
                {m.mentions} {m.mentions === 1 ? "mention" : "mentions"} · {m.category}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          Your emotional timeline · 30 days
        </p>
        <MoodGraph data={MOOD_DATA} />
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          Session history
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {SESSION_HISTORY.map((s, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 16,
                padding: "14px 0",
                borderBottom:
                  i < SESSION_HISTORY.length - 1 ? "1px solid var(--calm-ink-10)" : "none",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--calm-ink-40)", minWidth: 70 }}>{s.date}</span>
              <span className="body-micro" style={{ color: "var(--calm-forest)", minWidth: 70 }}>
                {s.mode}
              </span>
              <span style={{ fontSize: 13, color: "var(--calm-ink-40)", minWidth: 60 }}>{s.duration}</span>
              <span style={{ fontSize: 14, flex: 1, minWidth: 240 }}>{s.summary}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          Your data
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn-ghost">Download all my data (JSON)</button>
          <button className="btn-ghost">What does Calm Therapist know about me? (Full export)</button>
          <button className="btn-ghost" style={{ color: "var(--calm-ink)" }}>
            Delete all my data
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: last ? "none" : "1px solid var(--calm-ink-10)",
        gap: 24,
      }}
    >
      <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>{label}</span>
      <span style={{ fontSize: 14 }}>{value}</span>
    </div>
  );
}

function MoodGraph({ data }: { data: number[] }) {
  const w = 800;
  const h = 140;
  const max = 5;
  const min = 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="140" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="var(--calm-forest)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function languageLabel(code: string) {
  return ({ en: "English", ar: "Arabic", ur: "Urdu", hi: "Hindi", fr: "French", es: "Spanish" } as Record<string, string>)[code] ?? code;
}
