import { dbEnabled, prisma } from "./prisma";

export interface UsageEvent {
  service: "claude" | "elevenlabs";
  userId?: string;
  tokensIn?: number;
  tokensOut?: number;
  durationMs?: number;
  estimatedCostUsd?: number;
  at: string;
}

const globalAny = globalThis as unknown as { __calmUsage?: UsageEvent[] };
const memoryStore: UsageEvent[] = globalAny.__calmUsage ?? [];
globalAny.__calmUsage = memoryStore;

const CLAUDE_INPUT_PER_MTOK = 3.0;
const CLAUDE_OUTPUT_PER_MTOK = 15.0;

export async function recordClaudeUsage(input: {
  userId?: string;
  tokensIn?: number;
  tokensOut?: number;
  durationMs?: number;
}): Promise<void> {
  const cost =
    ((input.tokensIn ?? 0) / 1_000_000) * CLAUDE_INPUT_PER_MTOK +
    ((input.tokensOut ?? 0) / 1_000_000) * CLAUDE_OUTPUT_PER_MTOK;
  const event: UsageEvent = {
    service: "claude",
    userId: input.userId,
    tokensIn: input.tokensIn,
    tokensOut: input.tokensOut,
    durationMs: input.durationMs,
    estimatedCostUsd: Number(cost.toFixed(6)),
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
