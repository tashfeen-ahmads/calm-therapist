"use client";

import { Style } from "@/components/ui/Style";
import { Sidebar, SIDEBAR_COLLAPSED_KEY, SIDEBAR_EVENT } from "@/components/dashboard/Sidebar";
import { useEffect, useState } from "react";

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const sync = () => setCollapsed(readCollapsed());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(SIDEBAR_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SIDEBAR_EVENT, sync);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--calm-white)" }}>
      <Sidebar />
      <main className="dashboard-main" data-collapsed={collapsed ? "true" : "false"}>
        {children}
      </main>
      <Style>{`
        .dashboard-main {
          margin-left: 240px;
          min-height: 100vh;
          padding-bottom: 24px;
          transition: margin-left 0.22s ease;
        }
        .dashboard-main[data-collapsed="true"] { margin-left: 72px; }
        @media (max-width: 800px) {
          .dashboard-main, .dashboard-main[data-collapsed="true"] {
            margin-left: 0;
            padding-bottom: 80px;
          }
        }
      `}</Style>
    </div>
  );
}
