/**
 * Voice quota tracking — per-user, per-week and per-month buckets.
 *
 * Pro base allowance: 20 min / week (≈80 min / month).
 * Top-up pack ($12): +30 min this week, +50 min this month.
 * Free users: no voice access at all.
 *
 * MVP storage is in-memory on globalThis. Move to Prisma once the DB
 * lands.
 */

export interface VoiceQuotaState {
  userId: string;
  weekKey: string; // ISO week — e.g. "2026-W18"
  monthKey: string; // YYYY-MM
  weeklyUsedSec: number;
  monthlyUsedSec: number;
  weeklyBonusSec: number; // top-ups for the current week
  monthlyBonusSec: number; // top-ups for the current month
  topupsThisMonth: number; // count of top-ups, for billing
}

const globalAny = globalThis as unknown as { __calmVoiceQuota?: Map<string, VoiceQuotaState> };
const store: Map<string, VoiceQuotaState> = globalAny.__calmVoiceQuota ?? new Map();
globalAny.__calmVoiceQuota = store;

const PRO_WEEKLY_BASE_SEC = 20 * 60;
const PRO_MONTHLY_BASE_SEC = 80 * 60;

const TOPUP_PRICE_USD = 12;
const TOPUP_WEEKLY_BONUS_SEC = 30 * 60;
const TOPUP_MONTHLY_BONUS_SEC = 50 * 60;

function isoWeek(d: Date): string {
  // Thursday-anchored ISO week.
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((t.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
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

function ensure(userId: string): VoiceQuotaState {
  const now = new Date();
  const cur = store.get(userId);
  if (cur) {
    const rolled = rolledOver(cur, now);
    if (rolled !== cur) store.set(userId, rolled);
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
  store.set(userId, fresh);
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
  /** false when both windows are full or the user cannot start a turn. */
  canStart: boolean;
}

export function getVoiceQuotaSnapshot(userId: string, plan: "free" | "pro"): VoiceQuotaSnapshot {
  const s = ensure(userId);
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

export function recordVoiceMinutes(userId: string, minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return;
  const s = ensure(userId);
  const seconds = Math.round(minutes * 60);
  store.set(userId, {
    ...s,
    weeklyUsedSec: s.weeklyUsedSec + seconds,
    monthlyUsedSec: s.monthlyUsedSec + seconds,
  });
}

export function applyTopup(userId: string): { ok: true } | { ok: false; error: string } {
  const s = ensure(userId);
  // Cap top-ups at 4/month to prevent runaway costs.
  if (s.topupsThisMonth >= 4) {
    return { ok: false, error: "You've reached the top-up cap for this month." };
  }
  store.set(userId, {
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
