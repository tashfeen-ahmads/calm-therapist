import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--calm-white)", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
        <Logo animated={false} />
      </header>
      <main style={{ flex: 1, padding: "32px 24px 80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>{children}</div>
      </main>
      <footer style={{ padding: 24, textAlign: "center", fontSize: 13, color: "var(--calm-ink-40)" }}>
        Backed by{" "}
        <Link href="http://Implenix.net" target="_blank" rel="noopener noreferrer" style={{ color: "var(--calm-forest)" }}>
          Implenix.net
        </Link>
        . Your data belongs to you.
      </footer>
    </div>
  );
}
