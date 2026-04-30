import { listLeads } from "@/lib/leads";
import { feedbackStats, listFeedback } from "@/lib/feedback";
import { usageSummary } from "@/lib/usage";

// MVP: read in-memory user store directly via the same global handle.
import "@/lib/users";

interface UserSnapshot {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
  createdAt: string;
}

function readUsers(): UserSnapshot[] {
  const globalAny = globalThis as unknown as { __calmUsers?: Map<string, UserSnapshot> };
  if (!globalAny.__calmUsers) return [];
  return Array.from(globalAny.__calmUsers.values()).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    plan: u.plan,
    createdAt: u.createdAt,
  }));
}

const PRO_MONTHLY_USD = 19;

export interface AdminStats {
  signups: { total: number; last7d: number; last30d: number };
  leads: { total: number; last7d: number };
  conversion: { leadsToSignups: number; signupsToPro: number };
  paid: { proCount: number; mrrUsd: number; arrUsd: number };
  api: { claudeRequests: number; voiceRequests: number; totalCostUsd: number; totalTokensIn: number; totalTokensOut: number };
  feedback: { total: number; positive: number; needsAttention: number; average: number };
  liveUsers: number; // placeholder
  recurringUsers: number; // signups that are >7 days old still active (placeholder)
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function computeAdminStats(): AdminStats {
  const users = readUsers();
  const leads = listLeads();
  const usage = usageSummary();
  const fb = feedbackStats();

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

  // Live users = unique users with API events in the last 5 minutes.
  const recentUsage = (globalThis as unknown as { __calmUsage?: Array<{ userId?: string; at: string }> }).__calmUsage ?? [];
  const liveSet = new Set(
    recentUsage
      .filter((u) => Date.parse(u.at) >= now - 5 * 60 * 1000 && u.userId)
      .map((u) => u.userId)
  );
  const liveUsers = liveSet.size;

  // Recurring = users older than 7 days who have any usage event.
  const usersById = new Map(users.map((u) => [u.id, u]));
  const usedIds = new Set(recentUsage.map((u) => u.userId).filter(Boolean) as string[]);
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

export function listUsersForAdmin(): UserSnapshot[] {
  return readUsers().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function recentFeedback() {
  return listFeedback();
}

export function recentLeads() {
  return [...listLeads()].sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1));
}
