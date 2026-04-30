"use client";

import { useMemo, useState } from "react";

interface Point {
  date: string;
  count: number;
}

interface Props {
  data: Point[];
  height?: number;
  color?: string;
  fill?: string;
  showAxis?: boolean;
}

const PAD = 12;

export function Sparkline({ data, height = 120, color = "var(--calm-forest)", fill = "var(--calm-forest-10)", showAxis = true }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 600; // viewBox; SVG scales by width=100%
  const h = height;
  const inner = useMemo(() => {
    const n = data.length;
    if (n === 0) return { points: [] as { x: number; y: number; d: Point }[], path: "", area: "" };
    const max = Math.max(1, ...data.map((d) => d.count));
    const stepX = (w - PAD * 2) / Math.max(1, n - 1);
    const points = data.map((d, i) => {
      const x = PAD + i * stepX;
      const y = h - PAD - (d.count / max) * (h - PAD * 2);
      return { x, y, d };
    });
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${path} L ${points[points.length - 1].x},${h - PAD} L ${points[0].x},${h - PAD} Z`;
    return { points, path, area };
  }, [data, h]);

  const lastDate = data[data.length - 1]?.date;
  const firstDate = data[0]?.date;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: "block" }}
           onMouseLeave={() => setHover(null)}>
        {/* fill area */}
        {inner.area && <path d={inner.area} fill={fill} />}
        {/* baseline */}
        <line x1={PAD} x2={w - PAD} y1={h - PAD} y2={h - PAD} stroke="var(--calm-ink-10)" strokeWidth="1" />
        {/* line */}
        {inner.path && <path d={inner.path} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />}
        {/* points + hover targets */}
        {inner.points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={hover === i ? 4 : 2.4} fill={color} />
            <rect
              x={p.x - 16}
              y={0}
              width={32}
              height={h}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
            {hover === i && (
              <g>
                <line x1={p.x} x2={p.x} y1={PAD} y2={h - PAD} stroke="var(--calm-ink-10)" strokeDasharray="2 4" />
              </g>
            )}
          </g>
        ))}
      </svg>
      {hover !== null && inner.points[hover] && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: `${(inner.points[hover].x / w) * 100}%`,
            transform: "translate(-50%, -100%)",
            background: "var(--calm-ink)",
            color: "white",
            fontSize: 11,
            padding: "4px 8px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {inner.points[hover].d.count} · {inner.points[hover].d.date}
        </div>
      )}
      {showAxis && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "var(--calm-ink-40)" }}>
          <span>{firstDate}</span>
          <span>{lastDate}</span>
        </div>
      )}
    </div>
  );
}
