"use client";

import { useState } from "react";

interface Goal {
  id: string;
  title: string;
  description: string;
  daysActive: number;
  progress: number;
  history: boolean[];
}

const INITIAL: Goal[] = [
  {
    id: "g1",
    title: "Sleep before midnight",
    description: "Three nights this week.",
    daysActive: 28,
    progress: 2 / 3,
    history: [true, true, false, true, true, true, false],
  },
  {
    id: "g2",
    title: "One real conversation a week",
    description: "Not small talk. Something true.",
    daysActive: 28,
    progress: 1,
    history: [false, true, true, true, true, false, true],
  },
  {
    id: "g3",
    title: "Walk after dinner",
    description: "Four times this week.",
    daysActive: 14,
    progress: 1 / 4,
    history: [false, false, true, false, false, false, false],
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState(INITIAL);

  const addGoal = () => {
    if (goals.length >= 5) return;
    setGoals([
      ...goals,
      { id: `g${goals.length + 1}`, title: "New goal", description: "", daysActive: 0, progress: 0, history: [] },
    ]);
  };

  return (
    <div style={{ padding: "48px 32px", maxWidth: 880, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Goals</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        Small, specific, and yours.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </div>

      {goals.length < 5 && (
        <button onClick={addGoal} className="btn-ghost" style={{ marginBottom: 32 }}>
          + Add a goal ({goals.length}/5)
        </button>
      )}

      <div className="card-mist">
        <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>
          Calm Therapist&apos;s read on your goals
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8 }}>
          You&apos;re ahead on conversations and behind on sleep. That&apos;s not a failure — that&apos;s
          a pattern worth noticing. Your sleep tracks closely with your evening walks. If walking
          isn&apos;t happening, sleep isn&apos;t happening. Maybe the goal isn&apos;t sleep at all —
          maybe it&apos;s the walk.
        </p>
      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const dash = 2 * Math.PI * 22;
  const offset = dash * (1 - goal.progress);
  return (
    <div className="card" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="22" fill="none" stroke="var(--calm-ink-10)" strokeWidth="4" />
        <circle
          cx="30"
          cy="30"
          r="22"
          fill="none"
          stroke="var(--calm-forest)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          transform="rotate(-90 30 30)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text
          x="30"
          y="34"
          textAnchor="middle"
          fill="var(--calm-ink)"
          style={{ fontFamily: "var(--font-heading)", fontSize: 14 }}
        >
          {Math.round(goal.progress * 100)}%
        </text>
      </svg>
      <div style={{ flex: 1, minWidth: 200 }}>
        <h4>{goal.title}</h4>
        <p style={{ fontSize: 14, color: "var(--calm-ink-40)", marginTop: 4 }}>{goal.description}</p>
        <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
          {goal.history.map((done, i) => (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: done ? "var(--calm-forest)" : "var(--calm-ink-10)",
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ fontSize: 13, color: "var(--calm-ink-40)", textAlign: "right" }}>
        {goal.daysActive} days active
      </div>
    </div>
  );
}
