/**
 * Server-side ElevenLabs helpers. The API key never leaves the server.
 */

const BASE = "https://api.elevenlabs.io/v1";

function apiKey(): string | null {
  return process.env.ELEVENLABS_API_KEY ?? null;
}

export function agentId(): string | null {
  return process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? null;
}

export function elevenLabsConfigured(): boolean {
  return !!apiKey() && !!agentId();
}

/**
 * Mints a signed URL for a private agent. The agent should be set to
 * "private" in the ElevenLabs dashboard so that only URLs minted here can
 * start a conversation.
 */
export async function mintSignedUrl(): Promise<string | null> {
  const key = apiKey();
  const id = agentId();
  if (!key || !id) return null;
  const res = await fetch(`${BASE}/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(id)}`, {
    headers: { "xi-api-key": key },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[elevenlabs] signed url failed", res.status, await res.text().catch(() => ""));
    return null;
  }
  const data = (await res.json()) as { signed_url?: string };
  return data.signed_url ?? null;
}

export interface ConversationSummary {
  agentId?: string;
  status?: string;
  durationSec?: number;
}

/**
 * Reads a conversation's real duration from ElevenLabs. Used instead of
 * trusting the browser's own timer.
 */
export async function getConversation(conversationId: string): Promise<ConversationSummary | null> {
  const key = apiKey();
  if (!key) return null;
  const res = await fetch(`${BASE}/convai/conversations/${encodeURIComponent(conversationId)}`, {
    headers: { "xi-api-key": key },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[elevenlabs] conversation fetch failed", res.status);
    return null;
  }
  const data = (await res.json()) as {
    agent_id?: string;
    status?: string;
    metadata?: { call_duration_secs?: number };
  };
  return { agentId: data.agent_id, status: data.status, durationSec: data.metadata?.call_duration_secs };
}
