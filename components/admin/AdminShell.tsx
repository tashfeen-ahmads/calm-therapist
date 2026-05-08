"use client";

import { Style } from "@/components/ui/Style";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/emails", label: "Emails" },
  { href: "/admin/usage", label: "API & revenue" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="admin-root">
      <aside className="admin-side">
        <div className="admin-side-header">
          <span className="micro-label" style={{ color: "var(--calm-forest)" }}>Admin</span>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 18 }}>Calm Therapist</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ITEMS.map((it) => {
            const active = pathname === it.href || (it.href !== "/admin" && pathname?.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className="admin-link"
                data-active={active ? "true" : "false"}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/dashboard" className="admin-link">← Back to user dashboard</Link>
          <button onClick={logout} disabled={loggingOut} className="admin-link admin-link-button">
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>

      <Style>{`
        .admin-root {
          min-height: 100vh;
          display: flex;
          background: var(--calm-white);
        }
        .admin-side {
          width: 240px;
          flex-shrink: 0;
          padding: 24px 16px;
          border-right: 1px solid var(--calm-ink-10);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .admin-side-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 8px 16px;
          border-bottom: 1px solid var(--calm-ink-10);
        }
        .admin-link {
          padding: 10px 12px;
          border-radius: 8px;
          color: var(--calm-ink-70);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .admin-link:hover { background: var(--calm-ink-10); color: var(--calm-ink); }
        .admin-link[data-active="true"] {
          background: var(--calm-forest-10);
          color: var(--calm-forest);
        }
        .admin-link-button { width: 100%; }
        .admin-main {
          flex: 1;
          padding: 32px;
          overflow-x: auto;
        }
        @media (max-width: 800px) {
          .admin-root { flex-direction: column; }
          .admin-side { width: 100%; border-right: none; border-bottom: 1px solid var(--calm-ink-10); }
          .admin-main { padding: 24px; }
        }
      `}</Style>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div
      style={{
        background: "var(--calm-white)",
        border: "1px solid var(--calm-ink-10)",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-heading)", fontSize: 32, lineHeight: 1, color: "var(--calm-ink)" }}>
        {value}
      </span>
      {hint && <span style={{ fontSize: 12, color: "var(--calm-ink-40)" }}>{hint}</span>}
    </div>
  );
}
