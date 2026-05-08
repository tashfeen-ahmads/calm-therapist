"use client";

import { useEffect, useState } from "react";

interface QueuedEmail {
  id: string;
  to: string;
  templateKey: string;
  scheduledAt: string;
  sentAt?: string;
  status: "pending" | "sent" | "failed" | "cancelled";
  error?: string;
}

interface Payload {
  summary: { pending: number; sent: number; failed: number; cancelled: number };
  items: QueuedEmail[];
}

const FILTERS: { key: QueuedEmail["status"] | "all"; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "sent", label: "Sent" },
  { key: "failed", label: "Failed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];

export default function AdminEmailsPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [filter, setFilter] = useState<typeof FILTERS[number]["key"]>("pending");
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = () => {
    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const runProcessor = async () => {
    setRunning(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/emails?action=run", { method: "POST" });
      const d = await res.json();
      if (res.ok) {
        setMsg(`Processed ${d.attempted ?? 0} · ${d.sent ?? 0} sent · ${d.failed ?? 0} failed`);
        refresh();
      } else {
        setMsg(d.error ?? "Could not run.");
      }
    } catch {
      setMsg("Network error.");
    } finally {
      setRunning(false);
    }
  };

  const items =
    !data ? [] : filter === "all" ? data.items : data.items.filter((i) => i.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <h2 style={{ marginBottom: 0 }}>Email queue</h2>
        <button type="button" onClick={runProcessor} className="btn-primary" disabled={running}>
          {running ? "Running…" : "Run processor now"}
        </button>
      </div>
      <p style={{ color: "var(--calm-ink-70)", marginBottom: 24 }}>
        Lifecycle emails — welcome, day-2, day-7, inactivity ladder, crisis follow-up,
        top-up receipts. Production cron hits <code>/api/cron/emails</code>.
      </p>

      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Pending", value: data.summary.pending },
            { label: "Sent", value: data.summary.sent },
            { label: "Failed", value: data.summary.failed },
            { label: "Cancelled", value: data.summary.cancelled },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--calm-white)", border: "1px solid var(--calm-ink-10)", borderRadius: 12, padding: 16 }}>
              <p className="body-micro" style={{ color: "var(--calm-ink-40)" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, lineHeight: 1, marginTop: 4 }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`pill ${filter === f.key ? "active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {msg && (
        <p style={{ marginBottom: 12, fontSize: 13, color: "var(--calm-forest)" }}>{msg}</p>
      )}

      {items.length === 0 ? (
        <p style={{ color: "var(--calm-ink-40)", fontSize: 14 }}>Nothing in this bucket.</p>
      ) : (
        <div style={{ background: "var(--calm-white)", border: "1px solid var(--calm-ink-10)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--calm-mist)" }}>
                <Th>To</Th>
                <Th>Template</Th>
                <Th>Scheduled</Th>
                <Th>Sent</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid var(--calm-ink-10)" }}>
                  <Td>{e.to}</Td>
                  <Td>{e.templateKey}</Td>
                  <Td>{new Date(e.scheduledAt).toLocaleString()}</Td>
                  <Td>{e.sentAt ? new Date(e.sentAt).toLocaleString() : "—"}</Td>
                  <Td>
                    <span style={{
                      padding: "2px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background:
                        e.status === "sent" ? "var(--calm-forest)" :
                        e.status === "failed" ? "var(--calm-ink)" :
                        e.status === "cancelled" ? "var(--calm-ink-10)" :
                        "var(--calm-mist)",
                      color:
                        e.status === "sent" ? "white" :
                        e.status === "failed" ? "white" :
                        "var(--calm-ink-70)",
                    }}>
                      {e.status}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--calm-ink-70)" }}>
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 16px", fontSize: 14, color: "var(--calm-ink)" }}>{children}</td>;
}
