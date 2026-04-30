import { listUsersForAdmin } from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  const users = listUsersForAdmin();
  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Users</h2>
      <p style={{ color: "var(--calm-ink-70)", marginBottom: 32 }}>
        {users.length} total. Most recent first.
      </p>

      {users.length === 0 ? (
        <p style={{ color: "var(--calm-ink-40)", fontSize: 14 }}>No signups yet.</p>
      ) : (
        <div
          style={{
            background: "var(--calm-white)",
            border: "1px solid var(--calm-ink-10)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--calm-mist)" }}>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Plan</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid var(--calm-ink-10)" }}>
                  <Td>{u.name}</Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <span style={{
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: u.plan === "pro" ? "var(--calm-forest)" : "var(--calm-mist)",
                      color: u.plan === "pro" ? "white" : "var(--calm-ink)",
                      fontSize: 11,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}>
                      {u.plan}
                    </span>
                  </Td>
                  <Td>{new Date(u.createdAt).toLocaleString()}</Td>
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
