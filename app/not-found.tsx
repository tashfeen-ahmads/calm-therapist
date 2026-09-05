import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <PageShell>
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>404</p>
          <h1 style={{ marginBottom: 24, fontSize: 56 }}>That page isn&apos;t here.</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-70)", marginBottom: 32 }}>
            The link may be old, or it moved when we did. The conversation is still open.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/" className="btn-primary">Back to the start</Link>
            <Link href="/ai-therapist" className="btn-ghost">What an AI therapist is</Link>
            <Link href="/circles" className="btn-ghost">Circles</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
