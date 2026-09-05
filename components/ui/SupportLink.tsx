/**
 * "Support the creator" line. Ko-fi is a tip link, nothing more: it unlocks
 * nothing and is never described as a purchase. Renders nothing when
 * NEXT_PUBLIC_KOFI_URL is unset.
 */
export function SupportLink({
  variant = "inline",
  style,
}: {
  variant?: "inline" | "card" | "footer";
  style?: React.CSSProperties;
}) {
  const url = process.env.NEXT_PUBLIC_KOFI_URL;
  if (!url) return null;

  if (variant === "footer") {
    return (
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, ...style }}>
        Calm Therapist is free while we build it. If it has helped you,{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
          you can buy the creator a coffee
        </a>
        .
      </p>
    );
  }

  if (variant === "card") {
    return (
      <div
        className="card"
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "var(--calm-mist)",
          border: "1px solid var(--calm-forest-20)",
          ...style,
        }}
      >
        <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Free while we build it</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--calm-ink-70)", margin: 0 }}>
          Nothing here is for sale right now. If Aura has helped you and you want to support the
          person building her, you can buy them a coffee. It changes nothing about your account.
        </p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ alignSelf: "flex-start" }}>
          Buy the creator a coffee
        </a>
      </div>
    );
  }

  return (
    <p style={{ fontSize: 13, color: "var(--calm-ink-40)", ...style }}>
      Free while we build it. If it helped,{" "}
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--calm-forest)" }}>
        buy the creator a coffee
      </a>
      .
    </p>
  );
}
