import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { listLeads } from "@/lib/leads";
import { listFeedback } from "@/lib/feedback";
import { listUsage } from "@/lib/usage";
import { listAllUsers } from "@/lib/users";
import { bucketByDay, periodOverPeriodChange, totalOf } from "@/lib/timeseries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!claims?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const raw = Number(url.searchParams.get("days") ?? "30");
  const days = [7, 30, 90].includes(raw) ? raw : 30;

  const [users, leads, feedback, usage] = await Promise.all([
    listAllUsers(),
    listLeads(),
    listFeedback(),
    listUsage(),
  ]);

  const signups = bucketByDay(users, (u) => u.createdAt, days);
  const leadsSeries = bucketByDay(leads, (l) => l.capturedAt, days);
  const feedbackSeries = bucketByDay(feedback, (f) => f.createdAt, days);
  const requests = bucketByDay(usage, (u) => u.at, days);
  const proSignups = bucketByDay(
    users.filter((u) => u.plan === "pro"),
    (u) => u.createdAt,
    days
  );

  return NextResponse.json({
    days,
    series: {
      signups,
      leads: leadsSeries,
      feedback: feedbackSeries,
      requests,
      proSignups,
    },
    totals: {
      signups: totalOf(signups),
      leads: totalOf(leadsSeries),
      feedback: totalOf(feedbackSeries),
      requests: totalOf(requests),
      proSignups: totalOf(proSignups),
    },
    deltas: {
      signups: periodOverPeriodChange(users.map((u) => ({ at: u.createdAt })), days),
      leads: periodOverPeriodChange(leads.map((l) => ({ at: l.capturedAt })), days),
      feedback: periodOverPeriodChange(feedback.map((f) => ({ at: f.createdAt })), days),
      requests: periodOverPeriodChange(usage.map((u) => ({ at: u.at })), days),
    },
  });
}
