import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--calm-white)" }}>
      <header style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
        <Logo animated={false} />
      </header>
      <main style={{ padding: "32px 24px 80px" }}>{children}</main>
    </div>
  );
}
