"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AgentModeKey, UserProfile } from "@/lib/claude";
import type { ModeKey } from "@/lib/features";
import { ModeBar } from "./ModeBar";
import { CrisisBanner } from "./CrisisBanner";
import { Aftercare } from "./Aftercare";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatAgentProps {
  profile: UserProfile;
  mode?: ModeKey;
  memoryCount: number;
  sessionNumber: number;
  onSwitchToVoice?: () => void;
  initialOpener?: string;
}

export function ChatAgent({
  profile,
  mode = "chat",
  memoryCount,
  sessionNumber,
  onSwitchToVoice,
  initialOpener,
}: ChatAgentProps) {
  const opener =
    initialOpener ??
    (sessionNumber === 1
      ? `Hi ${profile.name}. I'm glad you came. We can take this slow. What's on your mind?`
      : `Hi ${profile.name}. Last time you mentioned a few things were sitting heavy. How are you arriving today?`);

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: opener, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activeMode, setActiveMode] = useState<AgentModeKey | null>(null);
  const [crisisTier, setCrisisTier] = useState(0);
  const [wrappingUp, setWrappingUp] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Mode resets to None each new browser tab/session — but persists while
    // the user is bouncing around the dashboard within a single tab.
    try {
      const raw = window.sessionStorage.getItem("calm-therapist:active-mode");
      if (raw) setActiveMode(raw as AgentModeKey);
      // Clear any old localStorage entries from earlier multi-select build.
      window.localStorage.removeItem("calm-therapist:active-mode");
      window.localStorage.removeItem("calm-therapist:active-modes");
    } catch {}
  }, []);

  const persistMode = (next: AgentModeKey | null) => {
    setActiveMode(next);
    try {
      if (next) window.sessionStorage.setItem("calm-therapist:active-mode", next);
      else window.sessionStorage.removeItem("calm-therapist:active-mode");
    } catch {}
  };

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "", timestamp: new Date().toISOString() }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          profile: { ...profile, activeModes: activeMode ? [activeMode] : [] },
          mode,
        }),
      });
      if (!res.body) throw new Error("No body");
      const tierHeader = Number(res.headers.get("X-Crisis-Tier") ?? "0");
      if (tierHeader > 0) setCrisisTier(tierHeader);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        // Strip the optional [crisis_tier:N] header chunk emitted by the server.
        const cleaned = acc.replace(/\n?\[crisis_tier:\d+\]\n?/g, "");
        setMessages((msgs) => {
          const copy = [...msgs];
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: cleaned };
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((msgs) => {
        const copy = [...msgs];
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: "Something went wrong on our side. Try again in a moment.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (wrappingUp) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
        <Aftercare name={profile.name} onClose={() => setWrappingUp(false)} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxWidth: 760, margin: "0 auto", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid var(--calm-ink-10)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
            Session {sessionNumber} · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </span>
          <span style={{ fontSize: 13, color: "var(--calm-forest)", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden
              style={{ width: 6, height: 6, borderRadius: 999, background: "var(--calm-forest)", display: "inline-block" }}
            />
            Aura remembers {memoryCount} {memoryCount === 1 ? "thing" : "things"} about you
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ModeBar active={activeMode} onChange={persistMode} />
          {onSwitchToVoice && (
            <button onClick={onSwitchToVoice} className="btn-ghost" style={{ height: 36, fontSize: 13 }}>
              Voice
            </button>
          )}
          <button
            type="button"
            onClick={() => setWrappingUp(true)}
            className="btn-ghost"
            style={{ height: 36, fontSize: 13 }}
            disabled={messages.length < 2}
            title="Wrap up the session"
          >
            Wrap up
          </button>
        </div>
      </div>


      {crisisTier > 0 && (
        <CrisisBanner tier={crisisTier} country={profile.culture?.countryOfResidence} onDismiss={() => setCrisisTier(0)} />
      )}

      <div ref={threadRef} className="subtle-scroll" style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: m.role === "user" ? "var(--calm-white)" : "var(--calm-mist)",
                border: "1px solid var(--calm-ink-10)",
                borderRadius: 12,
                padding: "14px 18px",
                maxWidth: "82%",
                fontSize: 16,
                lineHeight: 1.7,
                color: "var(--calm-ink)",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: 16, borderTop: "1px solid var(--calm-ink-10)", background: "var(--calm-white)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", maxWidth: 760, margin: "0 auto" }}>
          <textarea
            ref={taRef}
            className="input"
            placeholder="Take your time."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            style={{ resize: "none", minHeight: 48, maxHeight: 160 }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="btn-primary"
            style={{ height: 48 }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
