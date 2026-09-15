import Link from "next/link";
import { PageShell } from "@/components/seo/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";
import { AUTHOR, REVIEWER } from "@/lib/authorship";

export const metadata = pageMetadata({
  title: `Editorial policy | How we research and write | ${BRAND.name}`,
  description:
    "How Calm AI Therapy researches, writes, sources and corrects everything on this site — and the clinical claims we deliberately do not make.",
  path: "/editorial-policy",
});

/**
 * Mental health is a YMYL topic, so a reader is entitled to know who wrote
 * this, what they are qualified to say, and what happens when they get it
 * wrong. This page answers that in plain language rather than boilerplate.
 */
export default function EditorialPolicyPage() {
  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: BRAND.name, path: "/" },
          { name: "Editorial policy", path: "/editorial-policy" },
        ])}
      />
      <article className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Editorial policy" }]} />
          <h1 style={{ marginBottom: 24 }}>How we research and write</h1>
          <p className="body-large" style={{ color: "var(--calm-ink-70)", marginBottom: 48 }}>
            You are reading about mental health on the internet. You should know who is telling you
            this, what they are qualified to say, and what they are not.
          </p>

          <Section title="Who writes this">
            <p>{AUTHOR.name} writes everything on this site. {AUTHOR.credential}</p>
            <p>
              {REVIEWER ? (
                <>
                  Clinical content is reviewed by <strong>{REVIEWER.name}</strong>, {REVIEWER.credential}.
                </>
              ) : (
                <>
                  <strong>
                    Nothing here has been reviewed by a licensed clinician, and we are not going to
                    pretend otherwise.
                  </strong>{" "}
                  A lot of sites in this category display a doctor&apos;s photograph next to content
                  that doctor has never read. We would rather tell you the truth and let you weigh
                  it: this is carefully researched writing about the evidence, not clinical advice,
                  and it is not a substitute for talking to someone qualified. When a clinician does
                  review this content, their name will appear on this page and on the pages they
                  reviewed.
                </>
              )}
            </p>
          </Section>

          <Section title="Where the claims come from">
            <p>
              Where we make a factual claim about therapy, AI, or mental health outcomes, we cite
              the primary source — the study, the guideline, the regulator — not a secondary article
              about it. Reference lists sit at the bottom of the pages that carry them and link
              straight out.
            </p>
            <p>
              Where the evidence is thin or contested, we say so in the sentence rather than in a
              footnote. Research on AI mental health tools is young and much of it is funded by the
              companies selling the tools. That is worth knowing before you read anyone&apos;s
              numbers, including ours.
            </p>
          </Section>

          <Section title="What we will not claim">
            <p>
              We do not diagnose. We do not treat. We do not say this product is therapy, that it
              replaces a therapist, or that it is clinically proven to improve any condition. Aura
              is a place to think out loud with something that remembers you, and the writing here
              stays inside that claim.
            </p>
            <p>
              We do not publish content designed to keep you on the site longer than is good for
              you, and we do not write about a condition purely because the search volume is
              attractive.
            </p>
          </Section>

          <Section title="Crisis content">
            <p>
              Anything touching self-harm, suicide or abuse is held to a stricter standard: it
              names the limits of what a product can do, routes to real emergency services for the
              reader&apos;s country, and never suggests an AI is a substitute for a crisis line.{" "}
              <Link href="/is-ai-therapy-safe" style={{ color: "var(--calm-forest)" }}>
                How we handle safety
              </Link>{" "}
              sets out the mechanism.
            </p>
          </Section>

          <Section title="When we get it wrong">
            <p>
              Corrections are made on the page, and anything that changes the meaning of a claim is
              noted rather than quietly edited. If you find something inaccurate, tell us at{" "}
              <a href="mailto:hello@calmaitherapy.com" style={{ color: "var(--calm-forest)" }}>
                hello@calmaitherapy.com
              </a>{" "}
              and we will fix it or explain why we think it stands.
            </p>
          </Section>

          <Section title="How this is funded">
            <p>
              Talking to Aura is free and there is no advertising on this site. Nobody pays us to
              be mentioned, and no comparison page on this site is sponsored — including the ones
              that name competitors. The parts of the product that cost us money to run each minute
              are covered by members who choose to support the work, which is described in the{" "}
              <Link href="/terms" style={{ color: "var(--calm-forest)" }}>terms</Link>.
            </p>
          </Section>
        </div>
      </article>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ marginBottom: 16 }}>{title}</h2>
      <div
        style={{ fontSize: 17, lineHeight: 1.85, color: "var(--calm-ink)", display: "flex", flexDirection: "column", gap: 16 }}
      >
        {children}
      </div>
    </section>
  );
}
