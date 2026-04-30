"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CHAT_THREAD = [
  { role: "user", text: "Today felt like Tuesday. You know what I mean.", time: "10:24" },
  {
    role: "agent",
    text: "I do — three weeks running, you've named Tuesdays as your hardest day. Last time you tied it to your standup. Was it the standup again, or something else this week?",
    time: "10:24",
  },
  { role: "user", text: "It was the standup. And after, I just sat there.", time: "10:25" },
  {
    role: "agent",
    text: "That sitting is worth paying attention to. You've described it before as 'going dark' — same shape today, or different? If it's the same, I'd like to walk back through what you did to come out of it last time.",
    time: "10:25",
  },
];

const VOICE_SCRIPT =
  "I keep coming back to the same thought. That I'm letting people down. And then I get tired of hearing myself say it.";

export function AgentDemo() {
  const [tab, setTab] = useState<"chat" | "voice">("chat");
  const [voiceText, setVoiceText] = useState("");

  useEffect(() => {
    if (tab !== "voice") return;
    setVoiceText("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i > VOICE_SCRIPT.length) {
        clearInterval(id);
        return;
      }
      setVoiceText(VOICE_SCRIPT.slice(0, i));
    }, 35);
    return () => clearInterval(id);
  }, [tab]);

  return (
    <section style={{ background: "var(--calm-ink)", padding: "120px 24px", color: "white" }}>
      <div className="container">
        <h2 style={{ color: "white", marginBottom: 24 }}>
          This is what being understood actually looks like.
        </h2>
        <p
          className="body-large"
          style={{ color: "rgba(255,255,255,0.6)", maxWidth: 600, marginBottom: 48 }}
        >
          A live look at how Calm Therapist holds a conversation. Memory, depth, and presence — not
          filler.
        </p>

        <div
          style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.06)",
            padding: 4,
            borderRadius: 999,
            marginBottom: 32,
          }}
        >
          <DemoTab active={tab === "chat"} onClick={() => setTab("chat")}>
            Chat Agent
          </DemoTab>
          <DemoTab active={tab === "voice"} onClick={() => setTab("voice")}>
            Voice Agent
          </DemoTab>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16,
            padding: tab === "chat" ? "20px 16px" : 32,
            border: "1px solid rgba(255,255,255,0.08)",
            maxWidth: 760,
            margin: "0 auto",
          }}
        >
          {tab === "chat" ? (
            <ChatDemo />
          ) : (
            <VoiceDemo voiceText={voiceText} />
          )}
        </div>

        <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
            This is not a simulation. This is what your first session looks like.
          </p>
          <Link href="/auth/signup" className="btn-light">
            Start your session
          </Link>
        </div>
      </div>
    </section>
  );
}

function DemoTab({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: 999,
        background: active ? "white" : "transparent",
        color: active ? "var(--calm-ink)" : "rgba(255,255,255,0.7)",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        fontWeight: 500,
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

function ChatDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
      {CHAT_THREAD.map((m, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}
        >
          <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: m.role === "user" ? "white" : "rgba(214,232,228,0.95)",
                color: "var(--calm-ink)",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {m.text}
            </div>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
                marginTop: 4,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {m.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VoiceDemo({ voiceText }: { voiceText: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" }}>
      <div className="voice-waveform speaking">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="ring-core" />
      </div>
      <p className="body-micro" style={{ color: "rgba(255,255,255,0.5)", marginTop: 32 }}>
        Calm Therapist is listening
      </p>
      <div style={{ marginTop: 32, maxWidth: 560, width: "100%" }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.5,
            color: "white",
            textAlign: "center",
            minHeight: 100,
          }}
        >
          {voiceText}
          <span style={{ opacity: voiceText.length === VOICE_SCRIPT.length ? 0 : 0.6 }}>|</span>
        </p>
      </div>
    </div>
  );
}
