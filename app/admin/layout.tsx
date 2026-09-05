import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export const metadata = { title: { absolute: "Admin · Calm Therapist" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Authorization lives here as well as in middleware, so a middleware bypass
 * never exposes admin pages. Admin is decided by the database row, not by a
 * claim frozen in the cookie.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims) redirect("/auth/login?next=%2Fadmin");
  const user = await getUserById(claims.sub);
  if (!user || !user.isAdmin) redirect("/dashboard");
  return <AdminShell>{children}</AdminShell>;
}
