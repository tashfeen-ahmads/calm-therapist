"use client";

interface Props {
  next?: string;
  label?: string;
}

export function GoogleButton({ next = "/dashboard", label = "Continue with Google" }: Props) {
  const href = `/api/auth/google?next=${encodeURIComponent(next)}`;
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        height: 44,
        padding: "0 20px",
        borderRadius: 8,
        border: "1px solid var(--calm-ink-10)",
        background: "var(--calm-white)",
        color: "var(--calm-ink)",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        transition: "background 0.2s ease",
      }}
    >
      <GoogleIcon />
      {label}
    </a>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.5 2.7-3.8 2.7-6.4z"/>
      <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 15.9 5.5 18 9 18z"/>
      <path fill="#FBBC05" d="M3.9 10.7C3.7 10.2 3.6 9.6 3.6 9s.1-1.2.3-1.7V5H.9C.3 6.2 0 7.5 0 9s.3 2.8.9 4l3-2.3z"/>
      <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6C13.5.9 11.5 0 9 0 5.5 0 2.4 2.1.9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z"/>
    </svg>
  );
}

export function AuthDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <span style={{ flex: 1, height: 1, background: "var(--calm-ink-10)" }} />
      <span style={{ fontSize: 12, color: "var(--calm-ink-40)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        or
      </span>
      <span style={{ flex: 1, height: 1, background: "var(--calm-ink-10)" }} />
    </div>
  );
}
