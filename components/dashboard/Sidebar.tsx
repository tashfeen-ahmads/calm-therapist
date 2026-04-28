"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/session", label: "Session", icon: ChatIcon },
  { href: "/dashboard/journal", label: "Journal", icon: JournalIcon },
  { href: "/dashboard/reflect", label: "Reflect", icon: ReflectIcon },
  { href: "/dashboard/goals", label: "Goals", icon: GoalsIcon },
  { href: "/dashboard/profile", label: "Profile", icon: ProfileIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside
        className="dashboard-sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 64,
          background: "var(--calm-white)",
          borderRight: "1px solid var(--calm-ink-10)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          gap: 4,
          zIndex: 30,
          transition: "width 0.25s ease",
        }}
      >
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
          <Logo animated={false} showWordmark={false} size={32} />
        </div>
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link"
              data-active={active ? "true" : "false"}
            >
              <span className="sidebar-link-icon">
                <Icon active={active} />
              </span>
              <span className="sidebar-link-label">{item.label}</span>
            </Link>
          );
        })}
      </aside>

      <nav
        className="dashboard-tabbar"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "var(--calm-white)",
          borderTop: "1px solid var(--calm-ink-10)",
          zIndex: 40,
          padding: "0 8px",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                color: active ? "var(--calm-forest)" : "var(--calm-ink-40)",
                fontSize: 11,
              }}
            >
              <Icon active={active} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 10px;
          color: var(--calm-ink-40);
          transition: all 0.2s ease;
          overflow: hidden;
          white-space: nowrap;
        }
        .sidebar-link:hover { background: var(--calm-ink-10); }
        .sidebar-link[data-active="true"] {
          background: var(--calm-forest-10);
          color: var(--calm-forest);
        }
        .sidebar-link-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-link-label {
          font-size: 14px;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .dashboard-sidebar:hover { width: 220px; }
        .dashboard-sidebar:hover .sidebar-link-label { opacity: 1; }
        @media (max-width: 800px) {
          .dashboard-sidebar { display: none !important; }
          .dashboard-tabbar { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5}>
      <path d="M3 5h18v12H8l-5 4z" strokeLinejoin="round" />
    </svg>
  );
}
function JournalIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5}>
      <path d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4z" />
      <path d="M5 18h14" />
    </svg>
  );
}
function ReflectIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function GoalsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5}>
      <circle cx="12" cy="9" r="4" />
      <path d="M4 21c1-4 5-6 8-6s7 2 8 6" />
    </svg>
  );
}
function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </svg>
  );
}
