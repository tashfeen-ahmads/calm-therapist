import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service | Calm AI Therapy",
  description:
    "The terms for using Calm AI Therapy — what we promise, what we ask, and the limits of what an AI companion can do.",
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
            By using Calm AI Therapy you agree to the following. We&apos;ve kept it short and human.
            Last updated {LAST_UPDATED}.
          </p>

          <Section title="What this is, and what it is not">
            <p>
              <strong>Aura is software.</strong> She is not a therapist, not a counsellor, not a
              psychologist, and not a person. Calm AI Therapy is a general wellness product for
              reflecting on your own thinking. It is not a medical device, it is not healthcare,
              and nothing here is a clinical service.
            </p>
            <p>
              Specifically, and without exception, we do not and cannot:
            </p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>diagnose any condition, or tell you whether you have one;</li>
              <li>provide treatment, therapy, psychotherapy, or a treatment plan;</li>
              <li>advise on medication, dosage, starting, stopping or changing anything;</li>
              <li>act as a crisis or emergency service;</li>
              <li>replace care from a licensed professional.</li>
            </ul>
            <p>
              We make no claim that using this product improves, treats or cures any condition. No
              clinical trial supports such a claim, and you should be sceptical of any product in
              this category that makes one.
            </p>
            <p>
              <strong>If you are in immediate danger, contact your local emergency number.</strong>{" "}
              Aura will show you the crisis line for your country when the conversation calls for
              it, but she is not a substitute for one and cannot summon help on your behalf.
            </p>
            <p>
              Aura can be wrong. Language models state things confidently that are not true, and
              hers is no exception. Treat what she says as a thinking partner talking, not as
              guidance to act on without judgement.
            </p>
          </Section>

          <Section title="Where you are, and what your law says">
            <p>
              Rules for AI mental health tools differ by country and, in the United States, by
              state. Several states now restrict what such a product may do or be called, and at
              least one restricts how it may be advertised. We build to the strictest rule we know
              of rather than maintaining several versions of the truth: Aura tells you she is
              software without being asked, she never presents herself as a clinician, and every
              conversation passes through a crisis layer.
            </p>
            <p>
              You are responsible for whether using this product is permitted where you are. If you
              are a clinician, this product is not an instrument of care and must not be used as
              one with the people you treat.
            </p>
          </Section>

          <Section title="Your account">
            <ul style={{ listStyle: "disc", paddingLeft: 24, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>You must be 16 or older to use Calm AI Therapy.</li>
              <li>You are responsible for keeping your password safe and for activity on your account.</li>
              <li>One account per person. Don&apos;t share your login.</li>
              <li>Use a real email address — we send important account messages there.</li>
            </ul>
          </Section>

          <Section title="What you can do here">
            <p>You may use Calm AI Therapy for personal reflection, journaling, conversations with Aura, and saving your own goals and memories. You may not:</p>
            <ul style={{ listStyle: "disc", paddingLeft: 24, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Use the service to harm yourself or others.</li>
              <li>Scrape, reverse-engineer, or attempt to extract our prompts or model behavior.</li>
              <li>Resell access, share accounts commercially, or build a competing service on our infrastructure.</li>
              <li>Upload content that doesn&apos;t belong to you, or that targets, doxxes, or impersonates another person.</li>
              <li>Attempt to bypass safety classifiers or crisis-routing.</li>
            </ul>
          </Section>

          <Section title="Free access, and what a support pass buys">
            <p>
              Chat with Aura is free for everyone, with no trial period and no card. We do not
              intend to put chat behind a payment, and if that ever changed you would be told
              inside the app before it happened.
            </p>
            <p>
              Voice and circles are metered services that cost us money per minute, so they open on
              a <strong>support pass</strong>, from $5, processed by Ko-fi. What you pay determines
              how many voice minutes are added to your account and how long your circles seat stays
              open; both are shown in{" "}
              <Link href="/dashboard/settings" style={{ color: "var(--calm-forest)" }}>Settings</Link>.
              Voice minutes are yours outright and do not expire at the end of a month.
            </p>
            <p>
              <strong>Ko-fi presents support as monthly by default.</strong> You can choose a single
              payment instead at the time of paying. If you do leave it monthly, Ko-fi charges you
              again each month and each charge adds another set of voice minutes and extends your
              circles seat. You can cancel at any time from your own Ko-fi account, and we will
              cancel it for you on request. Cancelling stops future charges; it never removes voice
              minutes already on your account, which remain yours. We never see or store your card
              details — Ko-fi and its payment processor handle that entirely.
            </p>
            <p>
              We also ask you to tell us how Aura has been before a pass is issued. Any rating opens
              the gate, including a low one; your words stay private between you and us unless you
              separately tick the box allowing us to quote you. We never require a review to be
              public or positive in exchange for access.
            </p>
            <p>
              Unused voice minutes and unexpired circle access are refundable within 14 days if you
              ask us at the contact address below. Minutes you have already spent are not, since
              they have been paid onward to the voice provider.
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
              We aim for high uptime, but Calm AI Therapy is software — outages, maintenance, and
              third-party API hiccups happen. We can&apos;t guarantee uninterrupted service. If voice
              is unavailable, text remains open.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, Calm AI Therapy is not liable
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
              These terms are governed by the laws of the jurisdiction where Calm AI Therapy is
              registered. Disputes will be handled in the courts of that jurisdiction unless local
              consumer-protection law gives you a different right.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions, disputes, or just want to talk to a human? Email{" "}
              <a href="mailto:hello@calmaitherapy.com" style={{ color: "var(--calm-forest)" }}>
                hello@calmaitherapy.com
              </a>
              .
            </p>
          </Section>

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
