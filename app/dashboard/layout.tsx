import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--calm-white)" }}>
      <Sidebar />
      <main className="dashboard-main">{children}</main>
      <style>{`
        .dashboard-main {
          margin-left: 64px;
          min-height: 100vh;
          padding-bottom: 24px;
        }
        @media (max-width: 800px) {
          .dashboard-main {
            margin-left: 0;
            padding-bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
}
