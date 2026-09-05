import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Session check on the server, independent of middleware. The client shell
 * handles layout only.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) redirect("/auth/login?next=%2Fdashboard");
  return <DashboardShell>{children}</DashboardShell>;
}
