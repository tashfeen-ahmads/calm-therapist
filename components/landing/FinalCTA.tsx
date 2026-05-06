import Link from "next/link";

export function FinalCTA() {
  return (
    <section style={{ background: "var(--calm-forest)", padding: "120px 24px", color: "white" }}>
      <div className="container" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ color: "white" }}>You&apos;ve been carrying this long enough.</h2>
        <p
          className="body-large"
          style={{ marginTop: 24, color: "rgba(255,255,255,0.85)" }}
        >
          No appointment. No waiting list. No form before you feel anything.
        </p>
        <Link
          href="/auth/signup"
          className="btn-light"
          style={{ marginTop: 40, height: 52, padding: "0 32px", fontSize: 15 }}
        >
          Open your space
        </Link>
      </div>
    </section>
  );
}
