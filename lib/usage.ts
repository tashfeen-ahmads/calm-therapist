import { dbEnabled, prisma } from "./prisma";

export interface UsageEvent {
  service: "claude" | "elevenlabs";
  userId?: string;
  tokensIn?: number;
  tokensOut?: number;
  durationMs?: number;
  estimatedCostUsd?: number;
  stance?: string;
  ruleViolations?: string;
  at: string;
}

const globalAny = globalThis as unknown as { __calmUsage?: UsageEvent[] };
const memoryStore: UsageEvent[] = globalAny.__calmUsage ?? [];
globalAny.__calmUsage = memoryStore;

/** $ per million tokens: [input, cache read, output]. Unknown models fall back to Sonnet pricing. */
const PRICES: Record<string, [number, number, number]> = {
  "claude-sonnet-5": [2.0, 0.2, 10.0],
  "claude-sonnet-4-6": [3.0, 0.3, 15.0],
  "claude-haiku-4-5": [1.0, 0.1, 5.0],
  "claude-opus-5": [5.0, 0.5, 25.0],
};

export function estimateClaudeCost(model: string | undefined, tokensIn = 0, cacheRead = 0, tokensOut = 0): number {
  const [pin, pcache, pout] = PRICES[model ?? ""] ?? PRICES["claude-sonnet-5"];
  const uncached = Math.max(0, tokensIn - cacheRead);
  return (uncached / 1e6) * pin + (cacheRead / 1e6) * pcache + (tokensOut / 1e6) * pout;
}

export async function recordClaudeUsage(input: {
  userId?: string;
  tokensIn?: number;
  tokensOut?: number;
  cacheReadTokens?: number;
  durationMs?: number;
  model?: string;
  stance?: string;
  ruleViolations?: string;
}): Promise<void> {
  const cost = estimateClaudeCost(input.model, input.tokensIn, input.cacheReadTokens, input.tokensOut);
  const event: UsageEvent = {
    service: "claude",
    userId: input.userId,
    tokensIn: input.tokensIn,
    tokensOut: input.tokensOut,
    durationMs: input.durationMs,
    estimatedCostUsd: Number(cost.toFixed(6)),
    stance: input.stance,
    ruleViolations: input.ruleViolations,
    at: new Date().toISOString(),
  };
  if (dbEnabled) {
    await prisma.usageEvent.create({
      data: {
        service: "claude",
        userId: input.userId ?? null,
        tokensIn: input.tokensIn,
        tokensOut: input.tokensOut,
        durationMs: input.durationMs,
        estimatedCostUsd: event.estimatedCostUsd,
        stance: input.stance ?? null,
        ruleViolations: input.ruleViolations ?? null,
      },
    });
    return;
  }
  memoryStore.push(event);
}

export async function recordVoiceUsage(input: {
  userId?: string;
  durationMs?: number;
  estimatedCostUsd?: number;
}): Promise<void> {
  const event: UsageEvent = {
    service: "elevenlabs",
    userId: input.userId,
    durationMs: input.durationMs,
    estimatedCostUsd: input.estimatedCostUsd,
    at: new Date().toISOString(),
  };
  if (dbEnabled) {
    await prisma.usageEvent.create({
      data: {
        service: "elevenlabs",
        userId: input.userId ?? null,
        durationMs: input.durationMs,
        estimatedCostUsd: input.estimatedCostUsd,
      },
    });
    return;
  }
  memoryStore.push(event);
}

export async function listUsage(): Promise<UsageEvent[]> {
  if (dbEnabled) {
    const rows = await prisma.usageEvent.findMany({
      orderBy: { at: "desc" },
      take: 500,
    });
    return rows.map((r) => ({
      service: (r.service as "claude" | "elevenlabs") ?? "claude",
      userId: r.userId ?? undefined,
      tokensIn: r.tokensIn ?? undefined,
      tokensOut: r.tokensOut ?? undefined,
      durationMs: r.durationMs ?? undefined,
      estimatedCostUsd: r.estimatedCostUsd ?? undefined,
      at: r.at.toISOString(),
    }));
  }
  return [...memoryStore];
}

export async function usageSummary() {
  const events = await listUsage();
  const claude = events.filter((e) => e.service === "claude");
  const voice = events.filter((e) => e.service === "elevenlabs");
  const totalCost = events.reduce((s, e) => s + (e.estimatedCostUsd ?? 0), 0);
  const totalTokensIn = claude.reduce((s, e) => s + (e.tokensIn ?? 0), 0);
  const totalTokensOut = claude.reduce((s, e) => s + (e.tokensOut ?? 0), 0);
  return {
    claudeRequests: claude.length,
    voiceRequests: voice.length,
    totalTokensIn,
    totalTokensOut,
    totalCostUsd: Number(totalCost.toFixed(4)),
  };
}
