"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentModeKey } from "@/lib/claude";
import { AGENT_MODE_LIST } from "@/lib/agent-modes";
import { Style } from "@/components/ui/Style";

interface Props {
  active: AgentModeKey | null;
  onChange: (next: AgentModeKey | null) => void;
}

const SHORT: Record<AgentModeKey, string> = {
  burnout: "Burnout",
  relationships: "Relationships",
  grief: "Grief",
  "new-parent": "New parent",
  anxiety: "Anxiety",
};

export function ModeBar({ active, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const label = active ? SHORT[active] : "Set mode";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mode-trigger"
        data-active={active ? "true" : "false"}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="mode-trigger-dot" />
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div role="listbox" className="mode-menu">
          <button
            type="button"
            className="mode-option"
            data-active={!active ? "true" : "false"}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            None — general
          </button>
          {AGENT_MODE_LIST.map((m) => (
            <button
              key={m.key}
              type="button"
              className="mode-option"
              data-active={active === m.key ? "true" : "false"}
              onClick={() => {
                onChange(active === m.key ? null : m.key);
                setOpen(false);
              }}
              title={m.blurb}
            >
              <span style={{ display: "block", fontWeight: 500 }}>{SHORT[m.key]}</span>
              <span style={{ display: "block", fontSize: 12, color: "var(--calm-ink-40)", marginTop: 2 }}>
                {m.blurb}
              </span>
            </button>
          ))}
        </div>
      )}

      <Style>{`
        .mode-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 36px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid var(--calm-ink-10);
          background: var(--calm-white);
          color: var(--calm-ink-70);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .mode-trigger:hover { background: var(--calm-ink-10); }
        .mode-trigger[data-active="true"] {
          background: var(--calm-forest-10);
          border-color: var(--calm-forest-20);
          color: var(--calm-forest);
        }
        .mode-trigger-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--calm-ink-10);
          transition: background 0.15s ease;
        }
        .mode-trigger[data-active="true"] .mode-trigger-dot {
          background: var(--calm-forest);
        }
        .mode-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 260px;
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-radius: 12px;
          padding: 6px;
          z-index: 30;
          box-shadow: 0 16px 40px rgba(45,45,45,0.10);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mode-option {
          text-align: left;
          padding: 10px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--calm-ink);
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.3;
          width: 100%;
        }
        .mode-option:hover { background: var(--calm-ink-10); }
        .mode-option[data-active="true"] {
          background: var(--calm-forest-10);
          color: var(--calm-forest);
        }
        .mode-option[data-active="true"] span { color: inherit !important; }
      `}</Style>
    </div>
  );
}
