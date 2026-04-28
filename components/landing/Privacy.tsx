import Link from "next/link";

export function PrivacyBlock() {
  return (
    <section style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <h2>We have never. We will never.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "48px 0" }}>
          <ItalicLine>Sell your conversations.</ItalicLine>
          <ItalicLine>Train our models on your pain.</ItalicLine>
          <ItalicLine>Share your data without your knowledge.</ItalicLine>
        </div>
        <p className="body-base" style={{ color: "var(--calm-ink-40)", lineHeight: 1.8 }}>
          Calm Therapist runs on session-level encryption. We do not train models on your messages.
          You can export everything you&apos;ve ever said, anytime. You can delete it all in one
          click. We are committed to GDPR and HIPAA-aligned data handling, and we keep our promises
          in the open.
        </p>
        <Link
          href="/privacy"
          className="btn-ghost"
          style={{ marginTop: 32, display: "inline-flex" }}
        >
          Read the full privacy architecture
        </Link>
      </div>
    </section>
  );
}

function ItalicLine({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-heading)",
        fontStyle: "italic",
        fontSize: 32,
        lineHeight: 1.3,
        color: "var(--calm-ink)",
      }}
    >
      {children}
    </p>
  );
}
