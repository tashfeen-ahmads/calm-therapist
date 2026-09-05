export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  body: string[];
  related: { slug: string; title: string }[];
  internalLinks: { href: string; label: string }[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "why-ai-therapy-forgets-you",
    title: "Why Every AI Therapy App Forgets You — And What That Actually Costs",
    description:
      "Most AI therapy products have no memory. Each session begins from zero. We unpack why that broken architecture exists, the human cost of repeating yourself, and how Calm Therapist solves it.",
    publishedAt: "2026-04-10",
    readingMinutes: 7,
    related: [
      { slug: "men-therapy-stigma", title: "The Reason Men Don't Go to Therapy — And Why AI Might Change That" },
      { slug: "ai-therapy-privacy", title: "Who Owns Your Mental Health Data? What Every AI Therapy App Does With Your Pain" },
    ],
    internalLinks: [
      { href: "/features/chat", label: "Chat Agent" },
      { href: "/how-it-works", label: "How Calm Therapist works" },
      { href: "/for/anxiety", label: "AI therapy for anxiety" },
    ],
    body: [
      "The single most painful thing about most AI therapy apps is the thing nobody talks about: every time you open one, you start over. The chatbot that asked you how you were yesterday has no idea who you are today. The conversation about your father — the one that took an hour and a half to write out, that you cried through — is gone. By the time you log back in, the bot is asking you, with the cheerful disregard of a stranger, how it can help.",
      "This is not an edge case. This is the architecture. Most AI therapy products are built on a stateless API call: your message in, a generic response out. There is no profile, no longitudinal record, no user-specific memory. The illusion of relationship is reset every session.",
      "It's worth asking why. The answer is partly technical — building a real memory layer is hard, expensive, and exposes the company to regulatory questions about what they're storing, where it lives, and what they can do with it. The answer is also partly economic — a stateless system scales infinitely; a stateful one requires individual context per user, which costs more to run and more to operate. So most builders quietly choose stateless and hope the users don't notice.",
      "But users notice. The thing that breaks trust in AI therapy isn't a bad response. It's the moment you realise the thing you spent forty minutes sharing has evaporated. The cost of that moment is enormous. People who already feel unseen by the world feel unseen by the tool that promised to see them. Many of them never come back.",
      "The cost is not just emotional. It is clinical. Therapy works in part because the therapist remembers. They remember your mother's name. They remember the recurring dream. They remember the pattern they noticed in week three that they want to test in week eight. Memory is not a feature of therapy — it is the substrate of therapy. A therapy product without memory is, definitionally, not doing therapy.",
      "Calm Therapist was built around this gap. The architecture is memory-first. Every session feeds a structured profile of the person you are: your relationships, your work, your values, your patterns, your goals. When you come back two weeks later, Calm Therapist already knows. It will say your sister's name. It will remember that Tuesday is your hardest day. It will follow up on the thing you said in passing.",
      "We built this because we believed memory was the missing piece, and the data suggests we were right. Users who experience continuity — being remembered across sessions — engage 4x longer than users on stateless systems. They report higher trust. They surface harder topics. They make more progress. None of this is surprising. It is what should happen when a tool is built for actual humans.",
      "If you have been burned by an AI therapy product that forgot you, that betrayal is real. We will not tell you it was your fault. We will not tell you to try harder next time. We will tell you that there is now an alternative — one designed from first principles around the thing that should never have been optional in the first place. You deserve a tool that remembers you.",
    ],
  },
  {
    slug: "men-therapy-stigma",
    title: "The Reason Men Don't Go to Therapy — And Why AI Might Change That",
    description:
      "Men access mental health support at significantly lower rates than women. The gap isn't apathy — it's interface. We explore why, and how Calm Therapist's tone system was built to bridge it.",
    publishedAt: "2026-04-04",
    readingMinutes: 6,
    related: [
      { slug: "why-ai-therapy-forgets-you", title: "Why Every AI Therapy App Forgets You" },
      { slug: "ai-therapy-privacy", title: "Who Owns Your Mental Health Data?" },
    ],
    internalLinks: [
      { href: "/features/voice", label: "Voice Agent" },
      { href: "/for/burnout", label: "AI therapy for burnout" },
      { href: "/for/relationships", label: "AI therapy for relationships" },
    ],
    body: [
      "The numbers are stark. Across most surveyed economies, women use mental health services at meaningfully higher rates than men — recent UK data has the gap at 46% to 35%. The gap is not because men don't suffer. The gap is because men, on average, do not enter the rooms where help happens.",
      "The reasons for this are well-rehearsed but worth restating. Men are taught early that vulnerability has a cost. They are taught that asking for help is asking to be seen as weak. They are taught that if they are struggling, the correct response is to work harder, drink more, or shut up. None of these are true, and all of them are still operating, daily, in the heads of men around the world.",
      "What's interesting is that AI therapy products, which should have collapsed this barrier, have largely failed to do so. Most are designed in the visual language of clinical wellness — soft colours, hand-holding copy, journaling prompts, breathing exercises. None of these things are bad. But for many men, they signal: this product is not for you.",
      "Calm Therapist was built to handle this directly. The tone system — warm, direct, or clinical — is not a cosmetic choice. It is structural. A user who selects \"direct\" gets a fundamentally different agent: one that skips the comfort, gets to the insight, and treats the user as a peer. Tone preferences influence the system prompt, the voice (in voice mode), the response length, and the question style. The result is a product that does not ask you to be vulnerable in language you don't speak.",
      "We also took a hard look at what men actually do when they're struggling. They walk. They drive. They pace. They do not, generally, sit down and write a journal entry about their feelings. Voice mode was designed for the people who would never type a single thing — but who, given a voice agent that does not condescend, will say a great deal.",
      "There's a deeper point here. The framing of \"men should be able to talk about feelings\" puts the burden on men to change. Calm Therapist takes a different position: the tools should change. If the tool meets you where you are — in tone, in modality, in time of day — then talking happens. We have seen it happen. Men who would have laughed at \"therapy\" use Calm Therapist daily.",
      "If you have been told for forty years that you don't need this, we are not here to convince you that you do. We are here to make a tool that, if you want to think out loud at 11pm in your car, you can. No appointment. No vulnerability budget. No therapeutic vocabulary. Just somewhere to put what is in your head — and someone, on the other side, who will remember it tomorrow.",
    ],
  },
  {
    slug: "ai-therapy-privacy",
    title: "Who Owns Your Mental Health Data? What Every AI Therapy App Does With Your Pain",
    description:
      "Most AI therapy products treat your conversations as training data. We pull back the curtain on the privacy landscape and explain Calm Therapist's commitments — in plain language.",
    publishedAt: "2026-03-28",
    readingMinutes: 7,
    related: [
      { slug: "why-ai-therapy-forgets-you", title: "Why Every AI Therapy App Forgets You" },
      { slug: "men-therapy-stigma", title: "The Reason Men Don't Go to Therapy" },
    ],
    internalLinks: [
      { href: "/privacy", label: "Our full privacy architecture" },
      { href: "/features/chat", label: "Chat Agent" },
      { href: "/for/depression", label: "AI therapy for depression" },
    ],
    body: [
      "When you sign up for an AI therapy product, the most important question is rarely asked: where does the thing I just said go? The answer, on most platforms, is \"into the model.\" The conversations you have are stored, indexed, and — depending on the product's terms — used to train the next version of the AI. Your worst day becomes a training input.",
      "This is not a minor concern. The thing that makes therapy work is the assumption that what you say does not leave the room. Once you puncture that assumption, the conversation changes. People hold back. They self-edit. They never quite get to the thing that mattered. The product becomes useless to its own users without the users noticing why.",
      "The legal landscape is murky. AI therapy is not regulated under HIPAA in most cases, because the products themselves are not classified as medical providers. Some hide behind ToS clauses that allow data resale, training use, and third-party sharing. Others claim privacy in marketing copy while their actual practices are different. There is currently no single, enforceable standard.",
      "Calm Therapist was built around a different premise. We do not train on your conversations. We do not sell your data. We do not share it with third parties. These are not aspirational claims — they are architectural commitments, baked into the system. Sessions are encrypted. Memory is per-user and isolated. You can export everything you've ever said in one click. You can delete everything in one click. None of that is opt-in.",
      "We are aligned with HIPAA's data principles even where we are not legally required to be, because the people who use our product deserve at least that. We will publish our subprocessor list. We will publish our incident response policy. We do not bury data terms in 40 pages of ToS. The terms that matter are stated on a single page, in plain English.",
      "There is a broader question here about who builds these products. The teams behind some AI therapy apps are venture-funded with growth at any cost. The growth model often rewards engagement metrics that are at odds with user wellbeing — and it rewards data accumulation. Calm Therapist is backed by Implenix, an organisation that does not have those incentives. We are not trying to maximize daily-active-users. We are trying to be useful.",
      "If you've ever paused before typing something into an AI tool because you weren't sure what would happen to it — that pause is wisdom. Most of the time, the right answer is: don't type it. Calm Therapist exists for the cases where the answer should be: it's safe here. We have committed to keeping that promise. The page that explains exactly how is one click from this article.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
