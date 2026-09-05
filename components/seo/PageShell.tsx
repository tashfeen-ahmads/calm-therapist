import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ReactNode } from "react";
import { LeadPopupLazy } from "@/components/landing/LeadPopupLazy";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>{children}</main>
      <Footer />
      <LeadPopupLazy />
    </>
  );
}
