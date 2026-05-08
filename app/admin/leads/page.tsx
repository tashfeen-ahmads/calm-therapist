import { recentLeads } from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await recentLeads();
  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Leads</h2>
      <p style={{ color: "var(--calm-ink-70)", marginBottom: 32 }}>
        Captured by the lead-magnet popup across the marketing site. {leads.length} total.
      </p>

      {leads.length === 0 ? (
        <p style={{ color: "var(--calm-ink-40)", fontSize: 14 }}>No leads yet.</p>
      ) : (
        <div style={{ background: "var(--calm-white)", border: "1px solid var(--calm-ink-10)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--calm-mist)" }}>
                <Th>Email</Th>
                <Th>Source</Th>
                <Th>Captured</Th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} style={{ borderTop: "1px solid var(--calm-ink-10)" }}>
                  <Td>{l.email}</Td>
                  <Td style={{ color: "var(--calm-ink-70)" }}>{l.source}</Td>
                  <Td>{new Date(l.capturedAt).toLocaleString()}</Td>
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
