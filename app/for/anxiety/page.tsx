import { ConditionPageTemplate } from "@/components/seo/ConditionPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Therapy for Anxiety | Calm Therapist — Memory, Voice, and Real Help",
  description:
    "AI therapy designed for anxiety. Voice-first when typing is too much, full session memory, and a longitudinal record so you don't start over every time.",
  path: "/for/anxiety",
});

export default function AnxietyPage() {
  return (
    <ConditionPageTemplate
      slug="anxiety"
      condition="Anxiety"
      h1="AI therapy for anxiety — when typing is too much."
      feeling={[
        "Anxiety is not just \"worry.\" It is a body running fast and a mind that can't keep up. It is the chest tightness at 7am, the racing thoughts at 11pm, and the silence in between where you cannot remember what you were just doing.",
        "It is the email you've reread eleven times. It is the conversation you replayed for an hour. It is the fact that you can know, intellectually, that everything is fine, and still feel like nothing is fine.",
        "Most therapy apps ask you to describe it in a text box. The text box is part of the problem. When anxiety is high, typing is impossible. Your hands shake. Your thoughts run faster than your fingers. By the time you finish a sentence, the moment has passed.",
      ]}
      whyFails={`Standard AI therapy products treat anxiety as a category to look up, not a state to meet. They forget you between sessions, so every conversation begins by re-establishing context — the worst possible task for an anxious mind. They fall back on canned reassurances ("that sounds really hard") that anxious users see through immediately. And they have no way to handle the moments when anxiety becomes panic — no clear handoff, no grounding protocol, no human backup. Anxiety needs continuity. Most tools only offer episodes.`}
      ctFeatures={[
        { title: "Voice-first when needed", body: "When typing is impossible, you can speak. Calm Therapist's voice agent is built for anxious moments — short responses, slow pacing, no rush.", href: "/features/voice" },
        { title: "Memory that holds", body: "Anxious people repeat themselves because they have to. Calm Therapist remembers — your job, your relationships, your triggers — so you don't.", href: "/features/chat" },
        { title: "Pattern detection", body: "Most anxiety has triggers you haven't named yet. The weekly journal surfaces them in your own words.", href: "/features/journal" },
      ]}
      modeLinks={[
        { href: "/features/voice", label: "Voice Agent" },
        { href: "/features/chat", label: "Chat Agent" },
        { href: "/features/journal", label: "Weekly Journal" },
      ]}
      testimonials={[
        { name: "Priya, 28", text: "The voice mode is the reason I keep coming back. I can't type when I'm anxious. But I can speak. And Calm Therapist listens without rushing me." },
        { name: "Maya, 33", text: "It noticed I get worse on Tuesdays before I did. Just naming that has helped." },
        { name: "Daniel, 29", text: "I used to dread therapy because I had to explain my whole life every time. Calm Therapist already knows. It's a different feeling." },
      ]}
      faqs={[
        { q: "Is Calm Therapist a replacement for an anxiety therapist?", a: "No. Calm Therapist is a companion that helps you between sessions — or for moments where therapy isn't accessible. If you have a clinician, the longitudinal record is something you can share with them." },
        { q: "Does it help during a panic attack?", a: "Calm Therapist's voice mode is built for high-anxiety moments. It speaks slowly, uses grounding techniques, and never adds to your cognitive load. Crisis Safe activates automatically if your language indicates immediate danger." },
        { q: "Can it work without me typing?", a: "Yes. The voice agent uses ElevenLabs for natural conversation. You can have a full session without typing anything." },
        { q: "Will it remember my triggers?", a: "Yes. Memory is built into every mode. The longer you use Calm Therapist, the more accurately it understands your specific anxiety pattern." },
        { q: "Is my data safe?", a: "Calm Therapist does not train on your conversations. Sessions are encrypted at rest. You can export or delete everything at any time." },
      ]}
      related={[
        { href: "/for/depression", label: "For Depression" },
        { href: "/for/burnout", label: "For Burnout" },
        { href: "/blog/why-ai-therapy-forgets-you", label: "Why AI therapy forgets you" },
      ]}
    />
  );
}
