import { ConditionPageTemplate } from "@/components/seo/ConditionPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Therapy for Relationships | Calm Therapist — See the Pattern Clearly",
  description:
    "AI therapy for relationships. Calm Therapist surfaces the pattern across your conversations, partners, and family — not just one fight at a time.",
  path: "/for/relationships",
});

export default function RelationshipsPage() {
  return (
    <ConditionPageTemplate
      slug="relationships"
      condition="Relationships"
      h1="AI therapy for relationships — the ones we hurt and the ones that hurt us."
      feeling={[
        "Relationship pain is recursive. The argument you had Wednesday is the argument you had three Wednesdays ago. It rhymes with the argument with your last partner, and the one with your sister, and the one your father used to have with your mother.",
        "Most of us cannot see the shape of our own relational patterns. We can see the moment. We cannot see the years.",
        "Calm Therapist sits in the long view. It tracks how you talk about the people closest to you, the pattern of conflict, the language you use when you're hurt and the language you use when you've hurt someone.",
      ]}
      whyFails="Therapy products that operate on a per-session basis miss the pattern entirely. They engage with whatever's in front of them — Tuesday's fight — and lose the bigger arc. Calm Therapist is built around longitudinal memory, which means you can see the shape of a relationship, not just its incidents. People often discover they've described one specific dynamic 12 different times in 12 different ways. That discovery is where the work begins."
      ctFeatures={[
        { title: "Cross-session pattern", body: "Calm Therapist tracks how often a person comes up, what kind of language you use about them, and whether your tone changes over time.", href: "/features/journal" },
        { title: "Your own quotes back to you", body: "The Monthly Reflect surfaces direct quotes from your sessions. Your words about your partner, in your own voice, in chronological order.", href: "/features/reflect" },
        { title: "Voice for hard conversations", body: "Voice mode helps you rehearse what you actually want to say — without the partner, without the pressure.", href: "/features/voice" },
      ]}
      modeLinks={[
        { href: "/features/journal", label: "Weekly Journal" },
        { href: "/features/reflect", label: "Monthly Reflect" },
        { href: "/features/voice", label: "Voice Agent" },
      ]}
      testimonials={[
        { name: "Sara, 31", text: "It asked me how my sister was doing — the one I mentioned in passing two weeks ago. A human therapist has never done that." },
        { name: "Tom, 38", text: "Twelve identical arguments in one year. I had no idea until Calm Therapist showed me." },
        { name: "Imran, 33", text: "My wife and I are doing better. Mostly because I stopped making the same mistake every Sunday and didn't know it." },
      ]}
      faqs={[
        { q: "Can my partner use it too?", a: "Yes. Calm Therapist is single-user, but couples often each use it independently and bring insights back into the relationship." },
        { q: "Does it take sides?", a: "No. Calm Therapist's role is not to validate you against the other person. It surfaces patterns. What you do with them is yours." },
        { q: "Is it safe to talk about my partner here?", a: "Yes. Your data is encrypted and is never trained on. Only you see your sessions." },
        { q: "Can I export and share with a couples therapist?", a: "Yes. The longitudinal record exports as PDF or JSON and can be a useful artefact in joint therapy." },
        { q: "How long until I see a pattern?", a: "Most people see the first real pattern after three or four sessions. The Monthly Reflect is where the long-arc patterns become visible." },
      ]}
      related={[
        { href: "/for/grief", label: "For Grief" },
        { href: "/for/burnout", label: "For Burnout" },
        { href: "/blog/men-therapy-stigma", label: "Men, therapy, and the stigma we're done with" },
      ]}
    />
  );
}
