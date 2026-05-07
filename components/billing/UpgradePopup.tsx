"use client";

import { Style } from "@/components/ui/Style";
import { useState } from "react";

interface Props {
  /** Reason text shown at the top of the modal. */
  reason?: string;
  open: boolean;
  onClose: () => void;
  /** Called after a successful (mocked) upgrade. */
  onUpgraded?: (plan: "pro-monthly" | "pro-yearly") => void;
}

const MONTHLY_PRICE = 19;
const YEARLY_PRICE = 149;
const YEARLY_EFFECTIVE_PER_MONTH = (YEARLY_PRICE / 12).toFixed(2);

export function UpgradePopup({ reason, open, onClose, onUpgraded }: Props) {
  const [choice, setChoice] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const upgrade = async () => {
    setBusy(true);
    setError(null);
    try {
      // Stripe will replace this with a checkout session. For now we just
      // flip the user's plan via /api/auth/upgrade — same pattern already
      // used in settings.
      const res = await fetch("/api/auth/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not switch plans.");
        return;
      }
      onUpgraded?.(choice === "yearly" ? "pro-yearly" : "pro-monthly");
      onClose();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="upgrade-backdrop" role="dialog" aria-modal onClick={onClose}>
      <div className="upgrade-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="upgrade-close"
        >
          ×
        </button>

        <p className="micro-label" style={{ color: "var(--calm-forest)" }}>
          Open your space
        </p>
        <h3 style={{ marginTop: 10, marginBottom: 8 }}>
          {reason ?? "Voice is part of keeping your space open."}
        </h3>
        <p style={{ fontSize: 14, color: "var(--calm-ink-70)", lineHeight: 1.6, marginBottom: 24 }}>
          Pick how you want to keep going. Pause anytime.
        </p>

        <div className="upgrade-options">
          <button
            type="button"
            className="upgrade-option"
            data-active={choice === "monthly" ? "true" : "false"}
            onClick={() => setChoice("monthly")}
          >
            <div className="upgrade-option-row">
              <span className="upgrade-option-name">Monthly</span>
              <span className="upgrade-option-price">${MONTHLY_PRICE}<span className="upgrade-option-cadence">/mo</span></span>
            </div>
            <p className="upgrade-option-blurb">Light commitment. Pause whenever.</p>
          </button>

          <button
            type="button"
            className="upgrade-option"
            data-active={choice === "yearly" ? "true" : "false"}
            onClick={() => setChoice("yearly")}
          >
            <span className="upgrade-option-badge">Best value</span>
            <div className="upgrade-option-row">
              <span className="upgrade-option-name">Yearly</span>
              <span className="upgrade-option-price">${YEARLY_PRICE}<span className="upgrade-option-cadence">/yr</span></span>
            </div>
            <p className="upgrade-option-blurb">${YEARLY_EFFECTIVE_PER_MONTH}/month effective. Saves ${MONTHLY_PRICE * 12 - YEARLY_PRICE}.</p>
          </button>
        </div>

        <ul className="upgrade-bullets">
          <li>Voice agent — 20 minutes a week, included.</li>
          <li>Unlimited text conversations.</li>
          <li>Weekly journal + monthly look-back, written about you.</li>
          <li>Crisis-safe handoff to a real human, fast.</li>
          <li>Take your data with you anytime.</li>
        </ul>

        {error && (
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--calm-ink)" }}>{error}</p>
        )}

        <button
          type="button"
          className="btn-primary"
          style={{ marginTop: 20, width: "100%", height: 48 }}
          onClick={upgrade}
          disabled={busy}
        >
          {busy ? "Opening your space…" : choice === "yearly" ? `Keep my space open — $${YEARLY_PRICE}/year` : `Keep my space open — $${MONTHLY_PRICE}/month`}
        </button>

        <p className="upgrade-fineprint">Pause anytime. Cancel anytime. No medical claims.</p>
      </div>

      <Style>{`
        .upgrade-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(45, 45, 45, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          backdrop-filter: blur(4px);
        }
        .upgrade-card {
          width: 100%;
          max-width: 460px;
          background: var(--calm-white);
          border-radius: 18px;
          padding: 32px;
          position: relative;
          box-shadow: 0 30px 80px rgba(45,45,45,0.2);
          max-height: calc(100vh - 32px);
          overflow-y: auto;
        }
        .upgrade-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          color: var(--calm-ink-40);
          font-size: 22px;
          line-height: 1;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .upgrade-close:hover { background: var(--calm-ink-10); color: var(--calm-ink); }
        .upgrade-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }
        .upgrade-option {
          position: relative;
          text-align: left;
          padding: 16px 18px;
          border-radius: 12px;
          border: 1px solid var(--calm-ink-10);
          background: var(--calm-white);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .upgrade-option:hover { background: var(--calm-ink-10); }
        .upgrade-option[data-active="true"] {
          background: var(--calm-forest-10);
          border-color: var(--calm-forest);
        }
        .upgrade-option-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .upgrade-option-name {
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 500;
          color: var(--calm-ink);
        }
        .upgrade-option-price {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 500;
          color: var(--calm-ink);
        }
        .upgrade-option-cadence {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--calm-ink-40);
          margin-left: 4px;
        }
        .upgrade-option-blurb {
          margin-top: 4px;
          font-size: 12px;
          color: var(--calm-ink-70);
        }
        .upgrade-option-badge {
          position: absolute;
          top: -10px;
          right: 16px;
          padding: 3px 10px;
          border-radius: 999px;
          background: var(--calm-forest);
          color: white;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .upgrade-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .upgrade-bullets li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 13px;
          line-height: 1.55;
          color: var(--calm-ink-70);
        }
        .upgrade-bullets li::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--calm-forest);
          margin-top: 7px;
          flex-shrink: 0;
        }
        .upgrade-fineprint {
          margin-top: 12px;
          text-align: center;
          font-size: 11px;
          color: var(--calm-ink-40);
        }
      `}</Style>
    </div>
  );
}
