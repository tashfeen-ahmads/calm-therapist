"use client";

import type { AgentModeKey } from "@/lib/claude";
import { AGENT_MODE_LIST } from "@/lib/agent-modes";

interface Props {
  active: AgentModeKey[];
  onChange: (next: AgentModeKey[]) => void;
}

export function ModeBar({ active, onChange }: Props) {
  const toggle = (key: AgentModeKey) => {
    onChange(active.includes(key) ? active.filter((k) => k !== key) : [...active, key]);
  };
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "12px 24px", borderBottom: "1px solid var(--calm-ink-10)" }}>
      <span className="body-micro" style={{ color: "var(--calm-ink-40)", alignSelf: "center", marginRight: 4 }}>
        Modes
      </span>
      {AGENT_MODE_LIST.map((m) => {
        const isOn = active.includes(m.key);
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => toggle(m.key)}
            className={`pill ${isOn ? "active" : ""}`}
            title={m.blurb}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
