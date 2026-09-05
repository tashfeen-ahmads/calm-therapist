import { listLeads } from "@/lib/leads";
import { feedbackStats, listFeedback } from "@/lib/feedback";
import { listUsage, usageSummary } from "@/lib/usage";
import { listAllUsers, type UserRecord } from "@/lib/users";

const PRO_MONTHLY_USD = 19;

export interface AdminStats {
  signups: { total: number; last7d: number; last30d: number };
  leads: { total: number; last7d: number };
  conversion: { leadsToSignups: number; signupsToPro: number };
  paid: { proCount: number; mrrUsd: number; arrUsd: number };
  api: { llmRequests: number; voiceRequests: number; totalCostUsd: number; totalTokensIn: number; totalTokensOut: number };
  feedback: { total: number; positive: number; needsAttention: number; average: number };
  liveUsers: number;
  recurringUsers: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function computeAdminStats(): Promise<AdminStats> {
  const [users, leads, usage, fb, usageEvents] = await Promise.all([
    listAllUsers(),
    listLeads(),
    usageSummary(),
    feedbackStats(),
    listUsage(),
  ]);

  const now = Date.now();
  const since7 = now - 7 * DAY_MS;
  const since30 = now - 30 * DAY_MS;

  const signupsTotal = users.length;
  const signups7 = users.filter((u) => Date.parse(u.createdAt) >= since7).length;
  const signups30 = users.filter((u) => Date.parse(u.createdAt) >= since30).length;

  const proCount = users.filter((u) => u.plan === "pro").length;
  const mrr = proCount * PRO_MONTHLY_USD;

  const leadsTotal = leads.length;
  const leads7 = leads.filter((l) => Date.parse(l.capturedAt) >= since7).length;

  const leadsToSignups = leadsTotal === 0 ? 0 : signupsTotal / leadsTotal;
  const signupsToPro = signupsTotal === 0 ? 0 : proCount / signupsTotal;

  const liveSet = new Set(
    usageEvents
      .filter((u) => Date.parse(u.at) >= now - 5 * 60 * 1000 && u.userId)
      .map((u) => u.userId)
  );
  const liveUsers = liveSet.size;

  const usersById = new Map(users.map((u) => [u.id, u] as const));
  const usedIds = new Set(usageEvents.map((u) => u.userId).filter(Boolean) as string[]);
  let recurring = 0;
  usedIds.forEach((id) => {
    const u = usersById.get(id);
    if (u && Date.parse(u.createdAt) <= since7) recurring += 1;
  });

  return {
    signups: { total: signupsTotal, last7d: signups7, last30d: signups30 },
    leads: { total: leadsTotal, last7d: leads7 },
    conversion: {
      leadsToSignups: Number((leadsToSignups * 100).toFixed(1)),
      signupsToPro: Number((signupsToPro * 100).toFixed(1)),
    },
    paid: { proCount, mrrUsd: mrr, arrUsd: mrr * 12 },
    api: usage,
    feedback: fb,
    liveUsers,
    recurringUsers: recurring,
  };
}

export async function listUsersForAdmin(): Promise<UserRecord[]> {
  return listAllUsers();
}

export async function recentFeedback() {
  return listFeedback();
}

export async function recentLeads() {
  const list = await listLeads();
  return list.sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1));
}
