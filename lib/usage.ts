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
const store: UsageEvent[] = globalAny.__calmUsage ?? [];
globalAny.__calmUsage = store;

// Approximate Claude Sonnet 4 pricing (USD per 1M tokens). Update as needed.
const CLAUDE_INPUT_PER_MTOK = 3.0;
const CLAUDE_OUTPUT_PER_MTOK = 15.0;

export function recordClaudeUsage(input: { userId?: string; tokensIn?: number; tokensOut?: number; durationMs?: number }) {
  const cost =
    ((input.tokensIn ?? 0) / 1_000_000) * CLAUDE_INPUT_PER_MTOK +
    ((input.tokensOut ?? 0) / 1_000_000) * CLAUDE_OUTPUT_PER_MTOK;
  store.push({
    service: "claude",
    userId: input.userId,
    tokensIn: input.tokensIn,
    tokensOut: input.tokensOut,
    durationMs: input.durationMs,
    estimatedCostUsd: Number(cost.toFixed(6)),
    at: new Date().toISOString(),
  });
}

export function recordVoiceUsage(input: { userId?: string; durationMs?: number; estimatedCostUsd?: number }) {
  store.push({
    service: "elevenlabs",
    userId: input.userId,
    durationMs: input.durationMs,
    estimatedCostUsd: input.estimatedCostUsd,
    at: new Date().toISOString(),
  });
}

export function listUsage(): UsageEvent[] {
  return [...store];
}

export function usageSummary() {
  const claude = store.filter((e) => e.service === "claude");
  const voice = store.filter((e) => e.service === "elevenlabs");
  const totalCost = store.reduce((s, e) => s + (e.estimatedCostUsd ?? 0), 0);
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
