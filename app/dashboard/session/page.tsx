"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatAgent } from "@/components/agents/ChatAgent";
import { VoiceAgent } from "@/components/agents/VoiceAgent";
import { readState } from "@/components/onboarding/OnboardingShell";
import { loadMemories } from "@/lib/memory";
import { DEFAULT_PROFILE, UserProfile } from "@/lib/claude";

export default function SessionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 48 }}>Loading…</div>}>
      <SessionInner />
    </Suspense>
  );
}

function SessionInner() {
  const params = useSearchParams();
  const router = useRouter();
  const initialMode = params.get("mode") === "voice" ? "voice" : "chat";
  const [mode, setMode] = useState<"chat" | "voice">(initialMode);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    const memories = loadMemories();
    setMemoryCount(memories.length);
    setProfile({
      name: (s.name as string) || "friend",
      age: (s.age as string) || undefined,
      tone:
        s.tone === "direct" || s.tone === "clinical" || s.tone === "warm"
          ? (s.tone as UserProfile["tone"])
          : "warm",
      focusAreas: (s.focusAreas as string[]) ?? [],
      currentGoals: (s.goals as string[]) ?? [],
      sessionCount: 14,
      memories: memories.map((m) => m.statement),
      language: (s.language as string) ?? "en",
    });
  }, []);

  const switchMode = (next: "chat" | "voice") => {
    setMode(next);
    router.replace(`/dashboard/session?mode=${next}`);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {mode === "chat" ? (
        <ChatAgent
          profile={profile}
          mode="chat"
          memoryCount={memoryCount}
          sessionNumber={profile.sessionCount}
          onSwitchToVoice={() => switchMode("voice")}
        />
      ) : (
        <VoiceAgent
          profile={profile}
          onSwitchToChat={() => switchMode("chat")}
        />
      )}
    </div>
  );
}
