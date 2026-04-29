import { FeaturePageTemplate } from "@/components/seo/FeaturePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Chat Agent AI Therapy | Calm Therapist — Write Your Way Back",
  description:
    "Chat-based AI therapy that builds on every message. The Calm Therapist chat agent is structured, private, and builds a longitudinal record of your inner life.",
  path: "/features/chat",
});

export default function ChatModePage() {
  return (
    <FeaturePageTemplate
      slug="chat"
      label="Chat Agent"
      oneLiner="Write when you're not ready to speak. Structured, safe, and always available."
      problem={{
        title: "When the words come slowly.",
        body:
          "Speaking out loud sometimes makes it worse. Writing slows you down — long enough to find what you actually meant. The chat agent is built for that pace.",
      }}
      steps={[
        { title: "Open the thread", body: "It picks up where you left off, with a gentle reference to what stayed with you last time." },
        { title: "Type at your own pace", body: "Calm Therapist doesn't rush you. There's no \"thinking\" indicator. No artificial pressure." },
        { title: "Re-read your own words", body: "Everything you write is searchable in your profile. Your own thinking, surfaced back to you." },
      ]}
      who={[
        { title: "When you're at work", body: "A break room moment. Something you can't say out loud. The chat agent keeps it private." },
        { title: "When it's late", body: "3am, can't sleep. Calm Therapist is available. No appointment, no waiting." },
        { title: "When you don't trust voice", body: "Some people don't speak well. They write well. The chat agent honours that." },
      ]}
      related={[
        { href: "/features/voice", label: "Voice Agent" },
        { href: "/features/journal", label: "Weekly Journal" },
        { href: "/for/depression", label: "For Depression" },
      ]}
      body={[
        "The chat agent is Calm Therapist's most-used mode for a reason: it asks nothing of you. You can open it, type one sentence, and close it. The next time you open it, that sentence is still there — and Calm Therapist remembers what you wrote.",
        "Every chat session feeds a memory layer that no other AI therapy product currently offers. When you mention your sister in week three and the agent references her again in week eight, that's not magic — that's a structured memory system designed for longitudinal care.",
        "The chat agent works on every device. Your laptop, your phone in bed, the public computer at the library. Your data is encrypted at the session level and never trained on. Your conversations are yours.",
        "What it never does: it never produces canned affirmations, it never forgets you exist, it never tells you how to feel, and it never closes the conversation with a dead-end statement. Every response from Calm Therapist either reflects something specific back to you or asks one honest question.",
      ]}
    />
  );
}
