import { dbEnabled, prisma } from "./prisma";

/**
 * Voice quota tracking — per-user weekly + monthly buckets.
 *
 * Pro base allowance: 20 min / week (~80 min / month).
 * Top-up pack ($12): +30 min this week, +50 min this month.
 * Free users: no voice access at all.
 */

export interface VoiceQuotaState {
  userId: string;
  weekKey: string;
  monthKey: string;
  weeklyUsedSec: number;
  monthlyUsedSec: number;
  weeklyBonusSec: number;
  monthlyBonusSec: number;
  topupsThisMonth: number;
}

const globalAny = globalThis as unknown as { __calmVoiceQuota?: Map<string, VoiceQuotaState> };
const memoryStore: Map<string, VoiceQuotaState> = globalAny.__calmVoiceQuota ?? new Map();
globalAny.__calmVoiceQuota = memoryStore;

const PRO_WEEKLY_BASE_SEC = 20 * 60;
const PRO_MONTHLY_BASE_SEC = 80 * 60;

const TOPUP_PRICE_USD = 12;
const TOPUP_WEEKLY_BONUS_SEC = 30 * 60;
const TOPUP_MONTHLY_BONUS_SEC = 50 * 60;

function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((t.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7
    );
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function rolledOver(state: VoiceQuotaState, now: Date): VoiceQuotaState {
  const wk = isoWeek(now);
  const mk = monthKey(now);
  let next = state;
  if (state.weekKey !== wk) {
    next = { ...next, weekKey: wk, weeklyUsedSec: 0, weeklyBonusSec: 0 };
  }
  if (state.monthKey !== mk) {
    next = { ...next, monthKey: mk, monthlyUsedSec: 0, monthlyBonusSec: 0, topupsThisMonth: 0 };
  }
  return next;
}

async function ensure(userId: string): Promise<VoiceQuotaState> {
  const now = new Date();

  if (dbEnabled) {
    const row = await prisma.voiceQuota.findUnique({ where: { userId } });
    if (row) {
      const cur: VoiceQuotaState = {
        userId,
        weekKey: row.weekKey,
        monthKey: row.monthKey,
        weeklyUsedSec: row.weeklyUsedSec,
        monthlyUsedSec: row.monthlyUsedSec,
        weeklyBonusSec: row.weeklyBonusSec,
        monthlyBonusSec: row.monthlyBonusSec,
        topupsThisMonth: row.topupsThisMonth,
      };
      const rolled = rolledOver(cur, now);
      if (rolled !== cur) {
        await prisma.voiceQuota.update({
          where: { userId },
          data: {
            weekKey: rolled.weekKey,
            monthKey: rolled.monthKey,
            weeklyUsedSec: rolled.weeklyUsedSec,
            monthlyUsedSec: rolled.monthlyUsedSec,
            weeklyBonusSec: rolled.weeklyBonusSec,
            monthlyBonusSec: rolled.monthlyBonusSec,
            topupsThisMonth: rolled.topupsThisMonth,
          },
        });
      }
      return rolled;
    }
    const fresh: VoiceQuotaState = {
      userId,
      weekKey: isoWeek(now),
      monthKey: monthKey(now),
      weeklyUsedSec: 0,
      monthlyUsedSec: 0,
      weeklyBonusSec: 0,
      monthlyBonusSec: 0,
      topupsThisMonth: 0,
    };
    await prisma.voiceQuota.create({
      data: {
        userId,
        weekKey: fresh.weekKey,
        monthKey: fresh.monthKey,
      },
    });
    return fresh;
  }

  const cur = memoryStore.get(userId);
  if (cur) {
    const rolled = rolledOver(cur, now);
    if (rolled !== cur) memoryStore.set(userId, rolled);
    return rolled;
  }
  const fresh: VoiceQuotaState = {
    userId,
    weekKey: isoWeek(now),
    monthKey: monthKey(now),
    weeklyUsedSec: 0,
    monthlyUsedSec: 0,
    weeklyBonusSec: 0,
    monthlyBonusSec: 0,
    topupsThisMonth: 0,
  };
  memoryStore.set(userId, fresh);
  return fresh;
}

export interface VoiceQuotaSnapshot {
  weeklyLimitSec: number;
  weeklyUsedSec: number;
  weeklyRemainingSec: number;
  monthlyLimitSec: number;
  monthlyUsedSec: number;
  monthlyRemainingSec: number;
  weeklyBonusSec: number;
  monthlyBonusSec: number;
  topupsThisMonth: number;
  canStart: boolean;
}

export async function getVoiceQuotaSnapshot(userId: string, plan: "free" | "pro"): Promise<VoiceQuotaSnapshot> {
  const s = await ensure(userId);
  const baseW = plan === "pro" ? PRO_WEEKLY_BASE_SEC : 0;
  const baseM = plan === "pro" ? PRO_MONTHLY_BASE_SEC : 0;
  const weeklyLimit = baseW + s.weeklyBonusSec;
  const monthlyLimit = baseM + s.monthlyBonusSec;
  const weeklyRemaining = Math.max(0, weeklyLimit - s.weeklyUsedSec);
  const monthlyRemaining = Math.max(0, monthlyLimit - s.monthlyUsedSec);
  return {
    weeklyLimitSec: weeklyLimit,
    weeklyUsedSec: s.weeklyUsedSec,
    weeklyRemainingSec: weeklyRemaining,
    monthlyLimitSec: monthlyLimit,
    monthlyUsedSec: s.monthlyUsedSec,
    monthlyRemainingSec: monthlyRemaining,
    weeklyBonusSec: s.weeklyBonusSec,
    monthlyBonusSec: s.monthlyBonusSec,
    topupsThisMonth: s.topupsThisMonth,
    canStart: weeklyRemaining > 0 && monthlyRemaining > 0,
  };
}

export async function recordVoiceMinutes(userId: string, minutes: number): Promise<void> {
  if (!Number.isFinite(minutes) || minutes <= 0) return;
  const s = await ensure(userId);
  const seconds = Math.round(minutes * 60);

  if (dbEnabled) {
    await prisma.voiceQuota.update({
      where: { userId },
      data: {
        weeklyUsedSec: s.weeklyUsedSec + seconds,
        monthlyUsedSec: s.monthlyUsedSec + seconds,
      },
    });
    return;
  }
  memoryStore.set(userId, {
    ...s,
    weeklyUsedSec: s.weeklyUsedSec + seconds,
    monthlyUsedSec: s.monthlyUsedSec + seconds,
  });
}

export async function applyTopup(userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const s = await ensure(userId);
  if (s.topupsThisMonth >= 4) {
    return { ok: false, error: "You've reached the top-up cap for this month." };
  }
  if (dbEnabled) {
    await prisma.voiceQuota.update({
      where: { userId },
      data: {
        weeklyBonusSec: s.weeklyBonusSec + TOPUP_WEEKLY_BONUS_SEC,
        monthlyBonusSec: s.monthlyBonusSec + TOPUP_MONTHLY_BONUS_SEC,
        topupsThisMonth: s.topupsThisMonth + 1,
      },
    });
    return { ok: true };
  }
  memoryStore.set(userId, {
    ...s,
    weeklyBonusSec: s.weeklyBonusSec + TOPUP_WEEKLY_BONUS_SEC,
    monthlyBonusSec: s.monthlyBonusSec + TOPUP_MONTHLY_BONUS_SEC,
    topupsThisMonth: s.topupsThisMonth + 1,
  });
  return { ok: true };
}

export const VOICE_TOPUP = {
  priceUsd: TOPUP_PRICE_USD,
  weekMinutes: 30,
  monthMinutes: 50,
};
