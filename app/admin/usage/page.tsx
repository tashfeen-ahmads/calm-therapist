import { listUsage } from "@/lib/usage";
import { computeAdminStats } from "@/lib/admin-stats";
import { StatCard } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminUsagePage() {
  const [rawEvents, s] = await Promise.all([listUsage(), computeAdminStats()]);
  const sortedEvents = [...rawEvents].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 50);
  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>API & revenue</h2>
      <p style={{ color: "var(--calm-ink-70)", marginBottom: 32 }}>
        API spend is estimated against published pricing. Revenue assumes flat $19/mo per Pro user.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        <StatCard label="Pro accounts" value={s.paid.proCount} />
        <StatCard label="MRR (USD)" value={`$${s.paid.mrrUsd.toLocaleString()}`} />
        <StatCard label="ARR (USD)" value={`$${s.paid.arrUsd.toLocaleString()}`} />
        <StatCard label="Estimated API spend" value={`$${s.api.totalCostUsd.toFixed(2)}`} hint="Net margin tracker (Stripe coming)" />
        <StatCard label="Claude requests" value={s.api.claudeRequests} />
        <StatCard label="Voice sessions" value={s.api.voiceRequests} />
      </div>

      <h3 style={{ marginBottom: 16 }}>Recent API sortedEvents</h3>
      {sortedEvents.length === 0 ? (
        <p style={{ color: "var(--calm-ink-40)", fontSize: 14 }}>No sortedEvents recorded yet.</p>
      ) : (
        <div style={{ background: "var(--calm-white)", border: "1px solid var(--calm-ink-10)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--calm-mist)" }}>
                <Th>When</Th>
                <Th>Service</Th>
                <Th>Tokens</Th>
                <Th>Duration</Th>
                <Th>Est. cost</Th>
                <Th>User</Th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((e, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--calm-ink-10)" }}>
                  <Td>{new Date(e.at).toLocaleString()}</Td>
                  <Td>{e.service}</Td>
                  <Td>{e.tokensIn ?? "—"} / {e.tokensOut ?? "—"}</Td>
                  <Td>{e.durationMs ? `${(e.durationMs / 1000).toFixed(1)}s` : "—"}</Td>
                  <Td>{e.estimatedCostUsd != null ? `$${e.estimatedCostUsd.toFixed(4)}` : "—"}</Td>
                  <Td style={{ color: "var(--calm-ink-70)", fontSize: 12 }}>{e.userId ?? "anon"}</Td>
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
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: "12px 16px", fontSize: 14, color: "var(--calm-ink)", ...style }}>{children}</td>;
}
