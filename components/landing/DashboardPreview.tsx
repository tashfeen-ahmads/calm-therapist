"use client";

export function DashboardPreview() {
  return (
    <div
      style={{
        background: "var(--calm-white)",
        border: "1px solid var(--calm-ink-10)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 30px 80px rgba(45,45,45,0.06)",
        maxWidth: 460,
        marginLeft: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: "1px solid var(--calm-ink-10)",
        }}
      >
        <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>
          Session 14 · Wednesday
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--calm-forest)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--calm-forest)" }} />
          Live
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Bubble side="user">
          I had the same argument with my wife again. The one about her sister.
        </Bubble>
        <Bubble side="agent">
          That&apos;s the fourth time you&apos;ve described it this month. Last time you said you
          left the room before it escalated — what made today different?
        </Bubble>
        <Bubble side="user">I didn&apos;t leave. I tried to fix it.</Bubble>
        <Bubble side="agent">
          That&apos;s a shift. Tell me what &ldquo;fix it&rdquo; looked like — your words, not what
          you wish you&apos;d said.
        </Bubble>
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid var(--calm-ink-10)",
          fontSize: 12,
          color: "var(--calm-ink-40)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
        </svg>
        Calm Therapist remembers 47 things about you.
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "user" | "agent"; children: React.ReactNode }) {
  const isUser = side === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          background: isUser ? "var(--calm-white)" : "var(--calm-mist)",
          border: "1px solid var(--calm-ink-10)",
          borderRadius: 12,
          padding: "10px 14px",
          maxWidth: "85%",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--calm-ink)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
