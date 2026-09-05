import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service | Calm Therapist",
  description:
    "The terms for using Calm Therapist — what we promise, what we ask, and the limits of what an AI companion can do. Backed by Implenix.",
  path: "/terms",
});

const LAST_UPDATED = "May 2026";

export default function TermsPage() {
  return (
    <PageShell>
      <article style={{ padding: "120px 24px 80px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="micro-label micro-label-bordered" style={{ marginBottom: 24 }}>
            Terms
          </p>
          <h1 style={{ marginBottom: 32 }}>The terms, in plain English.</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 56 }}>
            By using Calm Therapist you agree to the following. We&apos;ve kept it short and human.
            Last updated {LAST_UPDATED}.
          </p>

          <Section title="What Calm Therapist is — and isn't">
            <p>
              Calm Therapist is an AI companion built to help you reflect, name what you&apos;re
              feeling, and keep your space open between hard moments. It is <strong>not a
              substitute for licensed mental-health care</strong>, a clinical diagnosis, or a crisis
              service. If you are in danger or in immediate distress, please reach out to a
              human — a trusted person, a clinician, or your country&apos;s crisis line.
            </p>
            <p>
              Aura, our AI companion, can make mistakes. Treat its responses as a thinking partner,
              not a prescription.
            </p>
          </Section>

          <Section title="Your account">
            <ul style={{ listStyle: "disc", paddingLeft: 24, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>You must be 16 or older to use Calm Therapist.</li>
              <li>You are responsible for keeping your password safe and for activity on your account.</li>
              <li>One account per person. Don&apos;t share your login.</li>
              <li>Use a real email address — we send important account messages there.</li>
            </ul>
          </Section>

          <Section title="What you can do here">
            <p>You may use Calm Therapist for personal reflection, journaling, conversations with Aura, and saving your own goals and memories. You may not:</p>
            <ul style={{ listStyle: "disc", paddingLeft: 24, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Use the service to harm yourself or others.</li>
              <li>Scrape, reverse-engineer, or attempt to extract our prompts or model behavior.</li>
              <li>Resell access, share accounts commercially, or build a competing service on our infrastructure.</li>
              <li>Upload content that doesn&apos;t belong to you, or that targets, doxxes, or impersonates another person.</li>
              <li>Attempt to bypass safety classifiers or crisis-routing.</li>
            </ul>
          </Section>

          <Section title="Subscriptions and billing">
            <p>
              Paid plans (monthly and yearly) renew automatically until you cancel. You can pause
              or cancel anytime from <Link href="/dashboard/settings" style={{ color: "var(--calm-forest)" }}>Settings</Link>.
              Cancellations take effect at the end of the current billing period — we don&apos;t prorate
              partial periods.
            </p>
            <p>
              Voice top-ups are one-time charges and non-refundable once applied to your quota.
              Subscription refunds are handled case-by-case within 14 days of charge — write to us.
            </p>
            <p>
              Prices can change. We&apos;ll email you at least 14 days before any price change affects
              your renewal.
            </p>
          </Section>

          <Section title="Your data, your conversations">
            <p>
              You own what you write here. We don&apos;t train AI models on your conversations, and we
              don&apos;t sell your data. The full picture is in our{" "}
              <Link href="/privacy" style={{ color: "var(--calm-forest)" }}>privacy architecture</Link>.
            </p>
            <p>
              You can export or delete everything from{" "}
              <Link href="/dashboard/settings" style={{ color: "var(--calm-forest)" }}>Settings</Link>.
              Deletion is permanent — we can&apos;t recover a deleted account.
            </p>
          </Section>

          <Section title="Safety routing">
            <p>
              When our safety classifier detects language consistent with crisis or risk of harm,
              Aura&apos;s reply will include crisis resources for your country and may pause the
              session. This is by design — your safety comes before flow.
            </p>
          </Section>

          <Section title="Service availability">
            <p>
              We aim for high uptime, but Calm Therapist is software — outages, maintenance, and
              third-party API hiccups happen. We can&apos;t guarantee uninterrupted service. If voice
              is unavailable, text remains open.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, Implenix and Calm Therapist are not liable
              for indirect, incidental, or consequential damages arising from your use of the
              service. Our total liability for any claim is limited to the amount you paid us in
              the twelve months before the claim.
            </p>
            <p>
              The service is provided &quot;as is.&quot; We make no warranty that the service will be
              error-free, uninterrupted, or fit for a particular purpose.
            </p>
          </Section>

          <Section title="Ending your account">
            <p>
              You can close your account anytime from Settings. We may suspend or close accounts
              that violate these terms, abuse safety routing, or threaten other users — we&apos;ll
              tell you why.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              If we change anything material, we&apos;ll let you know by email at least 14 days
              before it takes effect. Continued use after that means you accept the new terms.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of the jurisdiction where Implenix is
              registered. Disputes will be handled in the courts of that jurisdiction unless local
              consumer-protection law gives you a different right.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions, disputes, or just want to talk to a human? Email{" "}
              <a href="mailto:hello@calmtherapist.implenix.net" style={{ color: "var(--calm-forest)" }}>
                hello@calmtherapist.implenix.net
              </a>
              .
            </p>
          </Section>

          <p style={{ marginTop: 64, fontSize: 13, color: "var(--calm-ink-40)" }}>
            Calm Therapist is a product of{" "}
            <a href="https://implenix.net" target="_blank" rel="noopener noreferrer" style={{ color: "var(--calm-forest)" }}>
              Implenix.net
            </a>
            .
          </p>
        </div>
      </article>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ marginBottom: 16, fontSize: 22 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "var(--calm-ink-70)", fontSize: 15, lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );
}
