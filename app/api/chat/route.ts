import { streamChatResponse, UserProfile, DEFAULT_PROFILE, AgentModeKey } from "@/lib/claude";
import { MODES, ModeKey } from "@/lib/features";
import { modeAddendaFor } from "@/lib/agent-modes";
import { classifySafety } from "@/lib/safety-classifier";
import { crisisScriptFor, regionalResources } from "@/lib/crisis-scripts";
import { recordClaudeUsage } from "@/lib/usage";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import type Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequest {
  messages: Anthropic.MessageParam[];
  profile?: Partial<UserProfile>;
  mode?: ModeKey;
  voice?: boolean;
}

const VALID_AGENT_MODES: AgentModeKey[] = ["burnout", "relationships", "grief", "new-parent", "anxiety"];

function lastUserText(messages: Anthropic.MessageParam[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.content)) {
      return m.content.map((b) => ("text" in b ? b.text : "")).join(" ");
    }
  }
  return "";
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;

  const incomingModes = (body.profile?.activeModes ?? []).filter((m): m is AgentModeKey =>
    VALID_AGENT_MODES.includes(m as AgentModeKey)
  );

  const profile: UserProfile = {
    ...DEFAULT_PROFILE,
    ...body.profile,
    tone:
      body.profile?.tone === "direct" || body.profile?.tone === "clinical"
        ? body.profile.tone
        : "warm",
    focusAreas: body.profile?.focusAreas ?? [],
    memories: body.profile?.memories ?? [],
    currentGoals: body.profile?.currentGoals ?? [],
    culture: body.profile?.culture,
    activeModes: incomingModes,
  };

  // Compose the active-mode prompts and any feature-level addendum.
  const modeAddenda = modeAddendaFor(profile.activeModes);
  const featureAddendum = body.mode ? MODES[body.mode]?.systemAddendum : undefined;

  // Safety classifier on the latest user turn.
  const safety = classifySafety(lastUserText(body.messages));
  let crisisScript = crisisScriptFor(safety.route);
  if (crisisScript && profile.culture?.countryOfResidence) {
    const lines = regionalResources(profile.culture.countryOfResidence)
      .map((r) => `- ${r.name}: ${r.line}`)
      .join("\n");
    crisisScript += `\n\n# REGIONAL CRISIS RESOURCES (surface these to the user)\n${lines}`;
  }

  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  const userId = claims?.sub;
  const start = Date.now();

  if (!process.env.ANTHROPIC_API_KEY) {
    return mockStream(profile, body.messages, safety.tier);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Surface a tier banner header so the UI can render a crisis card.
      if (safety.tier > 0) {
        const header = `\n[crisis_tier:${safety.tier}]\n`;
        // Header is consumed by the client and stripped before render.
        controller.enqueue(encoder.encode(header));
      }

      let tokensIn: number | undefined;
      let tokensOut: number | undefined;
      try {
        const claudeStream = streamChatResponse(body.messages, profile, featureAddendum, {
          voice: body.voice,
          modeAddenda,
          crisisScript,
        });
        for await (const event of claudeStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
          if (event.type === "message_start" && "message" in event) {
            const msg = (event as unknown as { message: { usage?: { input_tokens?: number } } }).message;
            tokensIn = msg.usage?.input_tokens;
          }
          if (event.type === "message_delta" && "usage" in event) {
            const usage = (event as unknown as { usage?: { output_tokens?: number } }).usage;
            tokensOut = usage?.output_tokens;
          }
        }
      } catch (err) {
        console.error("Chat stream error", err);
        controller.enqueue(
          encoder.encode("Something went wrong on our side. Try again in a moment.")
        );
      } finally {
        controller.close();
        recordClaudeUsage({
          userId,
          tokensIn,
          tokensOut,
          durationMs: Date.now() - start,
        });
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Crisis-Tier": String(safety.tier),
      "X-Crisis-Category": safety.category,
    },
  });
}

function mockStream(profile: UserProfile, messages: Anthropic.MessageParam[], tier: number) {
  const last = messages[messages.length - 1];
  const lastText =
    typeof last?.content === "string"
      ? last.content
      : Array.isArray(last?.content)
      ? last.content.map((c) => ("text" in c ? c.text : "")).join(" ")
      : "";

  const response =
    tier > 0
      ? `${profile.name}, what you just said matters and I want to slow down here. Are you safe right now? You don't have to carry this alone — I'm staying right here with you.`
      : `${lastText.slice(0, 60)}${lastText.length > 60 ? "…" : ""} — I notice that's the second time something like that has come up. What does it feel like in your body right now?`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      if (tier > 0) {
        controller.enqueue(encoder.encode(`\n[crisis_tier:${tier}]\n`));
      }
      let i = 0;
      const id = setInterval(() => {
        i += 4;
        if (i >= response.length) {
          controller.enqueue(encoder.encode(response.slice(i - 4)));
          controller.close();
          clearInterval(id);
          return;
        }
        controller.enqueue(encoder.encode(response.slice(i - 4, i)));
      }, 30);
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
