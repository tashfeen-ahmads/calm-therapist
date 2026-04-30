import { streamChatResponse, UserProfile, DEFAULT_PROFILE } from "@/lib/claude";
import { MODES, ModeKey } from "@/lib/features";
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
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;

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
  };

  const addendum = body.mode ? MODES[body.mode]?.systemAddendum : undefined;

  const claims = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  const userId = claims?.sub;
  const start = Date.now();

  if (!process.env.ANTHROPIC_API_KEY) {
    return mockStream(profile, body.messages);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let tokensIn: number | undefined;
      let tokensOut: number | undefined;
      try {
        const claudeStream = streamChatResponse(body.messages, profile, addendum);
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
    },
  });
}

function mockStream(profile: UserProfile, messages: Anthropic.MessageParam[]) {
  const last = messages[messages.length - 1];
  const lastText =
    typeof last?.content === "string"
      ? last.content
      : Array.isArray(last?.content)
      ? last.content.map((c) => ("text" in c ? c.text : "")).join(" ")
      : "";

  const response =
    `I hear you, ${profile.name}. You said: "${lastText.slice(0, 80)}${lastText.length > 80 ? "..." : ""}" — what stays with you most when you read that back to yourself?`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
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
