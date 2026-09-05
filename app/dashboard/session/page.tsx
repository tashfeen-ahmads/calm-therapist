"use client";

import { Suspense } from "react";
import { ChatAgent } from "@/components/agents/ChatAgent";
import { useServerProfile } from "@/components/dashboard/useServerProfile";

export default function SessionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 48 }}>Loading…</div>}>
      <SessionInner />
    </Suspense>
  );
}

function SessionInner() {
  const { profile, memoryCount } = useServerProfile();
  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <ChatAgent profile={profile} mode="chat" memoryCount={memoryCount} sessionNumber={profile.sessionCount} />
    </div>
  );
}
