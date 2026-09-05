import { dbEnabled, prisma } from "./prisma";
import { getUserById, setCrisisTier } from "./users";
import type { CrisisTier } from "./safety-classifier";

/**
 * Crisis state and audit trail.
 *
 * The tier is sticky: once a member is at tier N, a lower classification on
 * the next message does not drop them below N for STICKY_MINUTES. "Yes" in
 * answer to "are you safe?" must not return Aura to the plain prompt.
 */

export const STICKY_MINUTES = Number(process.env.CRISIS_STICKY_MINUTES ?? 90);

export interface CrisisEventInput {
  userId?: string;
  tier: number;
  category: string;
  source: "chat" | "voice" | "feel-it" | "circle";
  country?: string;
}

interface MemoryEvent extends CrisisEventInput {
  id: string;
  createdAt: string;
}
const g = globalThis as unknown as { __calmCrisisEvents?: MemoryEvent[] };
const memoryEvents: MemoryEvent[] = g.__calmCrisisEvents ?? [];
g.__calmCrisisEvents = memoryEvents;

/** Records tier 2 and 3 events. Never deleted. */
export async function logCrisisEvent(e: CrisisEventInput): Promise<void> {
  if (e.tier < 2) return;
  if (dbEnabled) {
    try {
      await prisma.crisisEvent.create({
        data: { userId: e.userId ?? null, tier: e.tier, category: e.category, source: e.source, country: e.country ?? null },
      });
    } catch (err) {
      console.error("[crisis] log failed", (err as Error).message);
    }
    return;
  }
  memoryEvents.push({ ...e, id: `ce_${Date.now()}`, createdAt: new Date().toISOString() });
}

/**
 * Combines the classification of this message with the member's recent
 * state. Returns the tier to act on, and persists it when it changed.
 */
export async function effectiveTier(userId: string | undefined, classified: CrisisTier): Promise<CrisisTier> {
  if (!userId) return classified;
  const user = await getUserById(userId);
  if (!user) return classified;

  const prevAt = user.crisisTierAt ? new Date(user.crisisTierAt).getTime() : 0;
  const fresh = Date.now() - prevAt < STICKY_MINUTES * 60 * 1000;
  const prev = fresh ? (user.crisisTier as CrisisTier) : 0;
  const tier = (Math.max(prev, classified) as CrisisTier) ?? 0;

  // Persist escalations, and refresh the timestamp while a tier is active so
  // it stays sticky through a long conversation.
  if (tier > 0 && (tier !== user.crisisTier || !fresh)) {
    await setCrisisTier(userId, tier);
  } else if (tier > 0 && fresh) {
    await setCrisisTier(userId, tier);
  }
  return tier;
}

/** Recent tier-2+ events for a member, used by eligibility rules (circles). */
export async function recentCrisisEvents(userId: string, days = 14): Promise<number> {
  const since = new Date(Date.now() - days * 86400000);
  if (dbEnabled) {
    return prisma.crisisEvent.count({ where: { userId, createdAt: { gte: since } } });
  }
  return memoryEvents.filter((e) => e.userId === userId && new Date(e.createdAt) >= since).length;
}
