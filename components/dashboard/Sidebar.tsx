"use client";

import { Style } from "@/components/ui/Style";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const ITEMS = [
  { href: "/dashboard", label: "Today", icon: HomeIcon },
  { href: "/dashboard/session", label: "Talk", icon: ChatIcon },
  { href: "/dashboard/journal", label: "This week", icon: JournalIcon },
  { href: "/dashboard/reflect", label: "Looking back", icon: ReflectIcon },
  { href: "/dashboard/goals", label: "What you're after", icon: GoalsIcon },
  { href: "/dashboard/profile", label: "Your space", icon: ProfileIcon },
  { href: "/dashboard/settings", label: "Preferences", icon: SettingsIcon },
];

const STORAGE_KEY = "calm-therapist:sidebar-collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      <aside
        className="dashboard-sidebar"
        data-collapsed={mounted ? (collapsed ? "true" : "false") : "false"}
      >
        <div className="sidebar-header">
          <Logo animated={false} showWordmark={!collapsed} size={32} />
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="sidebar-toggle"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && !!pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-link"
                data-active={active ? "true" : "false"}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-link-icon">
                  <Icon active={active} />
                </span>
                <span className="sidebar-link-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="sidebar-link sidebar-link-button"
            title={collapsed ? "See you soon" : undefined}
            aria-label="See you soon"
          >
            <span className="sidebar-link-icon">
              <ExitIcon />
            </span>
            <span className="sidebar-link-label">{loggingOut ? "See you soon…" : "See you soon"}</span>
          </button>
        </div>
      </aside>

      <nav className="dashboard-tabbar">
        {ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && !!pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="tabbar-link"
              data-active={active ? "true" : "false"}
            >
              <Icon active={active} />
              <span>{shortLabel(item.label)}</span>
            </Link>
          );
        })}
      </nav>

      <Style>{`
        .dashboard-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 240px;
          background: var(--calm-white);
          border-right: 1px solid var(--calm-ink-10);
          display: flex;
          flex-direction: column;
          padding: 16px 12px;
          gap: 4px;
          z-index: 30;
          transition: width 0.22s ease;
        }
        .dashboard-sidebar[data-collapsed="true"] { width: 72px; }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 8px 16px;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--calm-ink-10);
          gap: 8px;
        }
        .dashboard-sidebar[data-collapsed="true"] .sidebar-header {
          justify-content: center;
        }
        .sidebar-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          color: var(--calm-ink-40);
          transition: background 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
        }
        .sidebar-toggle:hover {
          background: var(--calm-ink-10);
          color: var(--calm-ink);
        }
        .dashboard-sidebar[data-collapsed="true"] .sidebar-toggle {
          position: absolute;
          top: 16px;
          right: -14px;
          width: 28px;
          height: 28px;
          background: var(--calm-white);
          border: 1px solid var(--calm-ink-10);
          border-radius: 999px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .sidebar-footer {
          padding-top: 12px;
          border-top: 1px solid var(--calm-ink-10);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 12px;
          border-radius: 10px;
          color: var(--calm-ink-70);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-link:hover {
          background: var(--calm-ink-10);
          color: var(--calm-ink);
        }
        .sidebar-link[data-active="true"] {
          background: var(--calm-forest-10);
          color: var(--calm-forest);
        }
        .sidebar-link-button {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
        }
        .sidebar-link-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dashboard-sidebar[data-collapsed="true"] .sidebar-link-icon {
          margin: 0 auto;
        }
        .sidebar-link-label {
          opacity: 1;
          transition: opacity 0.2s ease;
          overflow: hidden;
        }
        .dashboard-sidebar[data-collapsed="true"] .sidebar-link {
          justify-content: center;
          padding: 10px 0;
          gap: 0;
        }
        .dashboard-sidebar[data-collapsed="true"] .sidebar-link-label {
          opacity: 0;
          width: 0;
          margin: 0;
          padding: 0;
          display: none;
        }
        .dashboard-sidebar[data-collapsed="true"] .sidebar-header {
          padding: 8px 0 16px;
        }

        .dashboard-tabbar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: var(--calm-white);
          border-top: 1px solid var(--calm-ink-10);
          z-index: 40;
          padding: 0 8px;
          align-items: center;
          justify-content: space-around;
        }
        .tabbar-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--calm-ink-40);
          font-size: 11px;
          font-weight: 500;
          padding: 8px 12px;
        }
        .tabbar-link[data-active="true"] { color: var(--calm-forest); }

        @media (max-width: 800px) {
          .dashboard-sidebar { display: none; }
          .dashboard-tabbar { display: flex; }
        }
      `}</Style>
    </>
  );
}

function shortLabel(s: string): string {
  if (s === "This week") return "Week";
  if (s === "Looking back") return "Back";
  if (s === "What you're after") return "Goals";
  if (s === "Your space") return "Space";
  return s;
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
function ExitIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
