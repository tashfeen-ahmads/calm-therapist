"use client";

import { regionalResources } from "@/lib/crisis-scripts";

interface Props {
  tier: number;
  country?: string;
  onDismiss?: () => void;
}

export function CrisisBanner({ tier, country, onDismiss }: Props) {
  const resources = regionalResources(country);
  return (
    <div
      role="alert"
      style={{
        margin: "12px 24px",
        padding: 16,
        background: "var(--calm-mist)",
        border: "1px solid var(--calm-forest-20)",
        borderLeft: "3px solid var(--calm-forest)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span className="body-micro" style={{ color: "var(--calm-forest)" }}>
          {tier >= 3 ? "If you're in danger right now" : tier === 2 ? "We're noticing something heavy" : "We hear you"}
        </span>
        {onDismiss && (
          <button onClick={onDismiss} aria-label="Dismiss" style={{ color: "var(--calm-ink-40)", fontSize: 18, lineHeight: 1 }}>
            ×
          </button>
        )}
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--calm-ink)" }}>
        {tier >= 3
          ? "What you said sounds urgent. Please consider reaching out to a person right now while we keep talking."
          : tier === 2
          ? "If thoughts of hurting yourself are louder than usual, here are people trained for exactly that."
          : "If anything we're saying gets too heavy, here are people you can reach out to."}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {resources.map((r) => (
          <li
            key={r.name}
            style={{ fontSize: 14, padding: "8px 12px", background: "var(--calm-white)", borderRadius: 8, border: "1px solid var(--calm-ink-10)" }}
          >
            <span style={{ fontWeight: 500 }}>{r.name}</span>{" "}
            <span style={{ color: "var(--calm-ink-70)" }}>· {r.line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
