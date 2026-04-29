"use client";

import { Style } from "@/components/ui/Style";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useEffect, useState } from "react";

const STORAGE_KEY = "calm-therapist:sidebar-collapsed";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      setCollapsed(saved === "1");
    };
    sync();
    window.addEventListener("storage", sync);
    const id = window.setInterval(sync, 250);
    return () => {
      window.removeEventListener("storage", sync);
      window.clearInterval(id);
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
