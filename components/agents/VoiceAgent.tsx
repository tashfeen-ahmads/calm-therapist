"use client";

import { useConversation } from "@11labs/react";
import { useEffect, useRef, useState } from "react";
import { UserProfile, composeSystemPrompt } from "@/lib/claude";
import { modeAddendaFor } from "@/lib/agent-modes";

interface VoiceAgentProps {
  profile: UserProfile;
  onSessionEnd?: (transcript: TranscriptEntry[]) => void;
  onSwitchToChat?: () => void;
}

interface TranscriptEntry {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

export function VoiceAgent({ profile, onSessionEnd, onSwitchToChat }: VoiceAgentProps) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => setError(null),
    onDisconnect: () => onSessionEnd?.(transcript),
    onMessage: ({ message, source }: { message: string; source: "user" | "ai" }) => {
      setTranscript((prev) => [
        ...prev,
        {
          role: source === "ai" ? "agent" : "user",
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    onError: (err: unknown) => {
      console.error("ElevenLabs error:", err);
      setError("Couldn't connect to voice. You can try again or switch to chat.");
    },
  });

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const startSession = async () => {
    if (!agentId) {
      setError(
        "Voice mode needs ELEVENLABS_AGENT_ID configured. You can use chat in the meantime."
      );
      return;
    }
    setIsRequesting(true);
    setError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const fullPrompt = composeSystemPrompt({
        profile,
        modeAddenda: modeAddendaFor(profile.activeModes),
        voice: true,
      });
      await conversation.startSession({
        agentId,
        overrides: {
          agent: {
            prompt: { prompt: fullPrompt },
            firstMessage: `Hi ${profile.name}. I'm here. How are you arriving today?`,
          },
          tts: {
            voiceId:
              profile.tone === "direct"
                ? "pNInz6obpgDQGcFmaJgB"
                : "EXAVITQu4vr4xnSDxMaL",
          },
        },
      });
    } catch (err) {
      console.error("Mic permission denied or session failed", err);
      setError("Microphone access is needed for voice mode.");
    } finally {
      setIsRequesting(false);
    }
  };

  const endSession = async () => {
    await conversation.endSession();
  };

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const isConnected = conversation.status === "connected";
  const agentSpeaking = conversation.isSpeaking;

  const stateClass = !isConnected
    ? "idle"
    : agentSpeaking
    ? "speaking"
    : "listening";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        padding: "48px 24px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <div className={`voice-waveform ${stateClass}`}>
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="ring-core" />
      </div>

      <p
        className="body-micro"
        style={{ color: "var(--calm-ink-40)" }}
      >
        {!isConnected && "Ready"}
        {isConnected && !agentSpeaking && "Listening"}
        {isConnected && agentSpeaking && "Calm Therapist is speaking"}
      </p>

      {error && (
        <p style={{ color: "var(--calm-ink)", fontSize: 14, textAlign: "center", maxWidth: 480 }}>
          {error}
        </p>
      )}

      {transcript.length > 0 && (
        <div
          ref={transcriptRef}
          className="subtle-scroll"
          style={{
            width: "100%",
            maxWidth: 560,
            maxHeight: 280,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {transcript.map((entry, i) => (
            <div
              key={i}
              style={{
                alignSelf: entry.role === "user" ? "flex-end" : "flex-start",
                background: entry.role === "user" ? "var(--calm-white)" : "var(--calm-mist)",
                border: "1px solid var(--calm-ink-10)",
                borderRadius: 12,
                padding: "12px 16px",
                maxWidth: "82%",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--calm-ink)",
              }}
            >
              {entry.content}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {!isConnected ? (
          <button onClick={startSession} disabled={isRequesting} className="btn-primary" style={{ minWidth: 180 }}>
            {isRequesting ? "Connecting..." : "Start voice session"}
          </button>
        ) : (
          <button onClick={endSession} className="btn-ghost">
            End session
          </button>
        )}
        {onSwitchToChat && (
          <button onClick={onSwitchToChat} className="btn-ghost">
            Switch to chat
          </button>
        )}
      </div>
    </div>
  );
}
