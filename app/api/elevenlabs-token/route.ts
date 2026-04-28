import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { agentId } = (await req.json()) as { agentId?: string };
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || !agentId) {
    return NextResponse.json({ token: null, error: "Missing ELEVENLABS_API_KEY or agentId" }, { status: 200 });
  }
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/token",
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId }),
      }
    );
    const data = await response.json();
    return NextResponse.json({ token: data.token ?? null });
  } catch (err) {
    console.error("ElevenLabs token error", err);
    return NextResponse.json({ token: null }, { status: 200 });
  }
}
