"use client";

import { Style } from "@/components/ui/Style";
import { useEffect, useState } from "react";
import { Sparkline } from "./Sparkline";

interface Point { date: string; count: number }

interface Payload {
  days: number;
  series: {
    signups: Point[];
    leads: Point[];
    feedback: Point[];
    requests: Point[];
    proSignups: Point[];
  };
  totals: { signups: number; leads: number; feedback: number; requests: number; proSignups: number };
  deltas: { signups: number; leads: number; feedback: number; requests: number };
}

const RANGES: { key: 7 | 30 | 90; label: string }[] = [
  { key: 7, label: "7 days" },
  { key: 30, label: "30 days" },
  { key: 90, label: "90 days" },
];

export function GrowthCharts() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/timeseries?days=${days}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "Failed");
        return r.json();
      })
      .then((d: Payload) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Could not load.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Growth</p>
        <div style={{ display: "inline-flex", background: "var(--calm-mist)", padding: 4, borderRadius: 999 }}>
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setDays(r.key)}
              className="growth-range"
              data-active={days === r.key ? "true" : "false"}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: 14, color: "var(--calm-ink)", padding: "10px 14px", background: "var(--calm-mist)", borderRadius: 8 }}>
          {error}
        </p>
      )}

      <div className="growth-grid">
        <ChartCard
          title="Signups"
          total={data?.totals.signups ?? 0}
          delta={data?.deltas.signups}
          loading={loading}
          data={data?.series.signups ?? []}
        />
        <ChartCard
          title="Leads (popup)"
          total={data?.totals.leads ?? 0}
          delta={data?.deltas.leads}
          loading={loading}
          data={data?.series.leads ?? []}
          color="#7C8FAA"
          fill="rgba(124,143,170,0.12)"
        />
        <ChartCard
          title="Pro signups"
          total={data?.totals.proSignups ?? 0}
          loading={loading}
          data={data?.series.proSignups ?? []}
          color="var(--calm-forest-deep)"
        />
        <ChartCard
          title="API requests"
          total={data?.totals.requests ?? 0}
          delta={data?.deltas.requests}
          loading={loading}
          data={data?.series.requests ?? []}
          color="#3B5C53"
        />
        <ChartCard
          title="Feedback"
          total={data?.totals.feedback ?? 0}
          delta={data?.deltas.feedback}
          loading={loading}
          data={data?.series.feedback ?? []}
          color="#A26B4A"
          fill="rgba(162,107,74,0.10)"
        />
      </div>

      <Style>{`
        .growth-range {
          padding: 6px 14px;
          border-radius: 999px;
          background: transparent;
          color: var(--calm-ink-70);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .growth-range[data-active="true"] {
          background: var(--calm-white);
          color: var(--calm-ink);
          box-shadow: 0 1px 2px rgba(45,45,45,0.08);
        }
        .growth-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
      `}</Style>
    </section>
  );
}

function ChartCard({
  title,
  total,
  delta,
  loading,
  data,
  color,
  fill,
}: {
  title: string;
  total: number;
  delta?: number;
  loading: boolean;
  data: Point[];
  color?: string;
  fill?: string;
}) {
  const deltaPositive = (delta ?? 0) >= 0;
  return (
    <div
      style={{
        background: "var(--calm-white)",
        border: "1px solid var(--calm-ink-10)",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>{title}</span>
        {delta !== undefined && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: deltaPositive ? "var(--calm-forest)" : "var(--calm-ink-70)",
            }}
            title="Versus the previous equal-length window"
          >
            {deltaPositive ? "+" : ""}
            {delta}% vs prev.
          </span>
        )}
      </div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 28, lineHeight: 1, color: "var(--calm-ink)" }}>
        {loading ? "…" : total.toLocaleString()}
      </div>
      <Sparkline data={data} color={color} fill={fill} />
    </div>
  );
}
