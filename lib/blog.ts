export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  /** Feature image, served from /public/blog. Abstract rather than stock photography. */
  image: string;
  body: string[];
  related: { slug: string; title: string }[];
  internalLinks: { href: string; label: string }[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "what-therapists-say-about-ai-therapy",
    image: "/blog/what-therapists-say-about-ai-therapy.svg",
    title: "77% of Therapists Say Their Patients Are Already Using AI. Here Is What Worries Them.",
    description:
      "The APA surveyed psychologists in 2026 about patients bringing AI into therapy. The numbers are striking, the concerns are specific, and most of them are fair. We go through them one at a time.",
    publishedAt: "2026-09-16",
    readingMinutes: 9,
    related: [
      { slug: "ai-therapy-crisis-gap", title: "The Question Chatbots Are Worst At" },
      { slug: "states-banning-ai-therapy", title: "The States That Restricted AI Therapy" },
    ],
    internalLinks: [
      { href: "/is-ai-therapy-safe", label: "Is AI therapy safe?" },
      { href: "/ai-therapist-vs-human-therapist", label: "AI vs a human therapist" },
      { href: "/editorial-policy", label: "How we research and write" },
    ],
    body: [
      "The American Psychological Association ran a survey in 2026 asking psychologists what they were seeing. Seventy-seven percent said their patients report using AI. More than a third said patients were using it as an additional mental health provider, not as a search engine or a journal, but as someone else in the room.",
      "That is a large number, and it arrived faster than anyone planned for. It is worth sitting with what the same psychologists said about it, because the concerns are specific and most of them are correct. We build one of these products. We would rather engage the criticism than route around it.",
      "The first concern is data. Two thirds of psychologists said they were worried about breaches. They are right to be. Mental health data is the most sensitive category there is, and the industry's record is poor. Our answer is architectural rather than reassuring: your conversations are stored in your account, not pooled into a training set, and you can delete all of it from Settings in one action. We do not train models on what you write, and we do not sell it. That is a claim you should check rather than take, which is why the delete button is one click and not an email request.",
      "The second is accuracy. Around sixty percent were concerned about inaccurate or biased outputs, and about the absence of rigorous testing. This is the hardest one to answer honestly, because it is true of every product in this category including ours. A language model states false things with the same confidence it states true ones. What can be done is narrowing what the thing is allowed to do: Aura does not diagnose, does not name conditions, and does not touch medication, because those are the places where a confident wrong answer does real damage. She is built to ask before she teaches, and to be a place to think out loud rather than an authority to defer to.",
      "The third is the therapeutic alliance, and it is the one we have least to offer on. The relationship is the part of therapy that the evidence supports most strongly, and it is made of warmth, attunement, being known over time, and a person choosing to sit with you. An AI has memory and availability. It does not have the rest of it. Anyone selling you an AI as a replacement for that relationship is selling you something they cannot deliver.",
      "What the survey also shows is why people are doing it anyway. Waiting lists are long. Sessions cost money. The worst hour is usually not during office hours. A tool that is there at three in the morning and remembers what you said last week is not competing with a good therapist. It is competing with nothing, which is what most people have at three in the morning.",
      "That is the honest position. Not a replacement, not a treatment, not a clinician. Something that is there in the gap, that does not forget you, and that tells you plainly when what you need is a person.",
      "The same psychologists, notably, are using these tools themselves. Around half reported using AI at work for notes and correspondence. The profession is not reflexively hostile to the technology. It is specifically worried about it sitting across from a patient unsupervised, which is a narrower and much more reasonable objection than the headlines suggest.",
    ],
  },
  {
    slug: "states-banning-ai-therapy",
    image: "/blog/states-banning-ai-therapy.svg",
    title: "Several US States Restricted AI Therapy. Here Is What Each One Actually Says.",
    description:
      "Illinois, Nevada and Utah took three different approaches to regulating AI mental health tools, and California and New York took a fourth. A plain-language guide to what changed and what it means for you.",
    publishedAt: "2026-09-16",
    readingMinutes: 8,
    related: [
      { slug: "what-therapists-say-about-ai-therapy", title: "What Therapists Say About AI Therapy" },
      { slug: "ai-therapy-privacy", title: "Who Owns Your Mental Health Data?" },
    ],
    internalLinks: [
      { href: "/terms", label: "Our terms, in plain language" },
      { href: "/is-ai-therapy-safe", label: "Is AI therapy safe?" },
      { href: "/what-is-an-ai-therapist", label: "What is an AI therapist?" },
    ],
    body: [
      "In 2025 and 2026 a number of US states wrote laws about AI and mental health, and they did not agree with each other. If you use one of these products, or build one, the differences matter more than the headlines do.",
      "Illinois went furthest. The Wellness and Oversight for Psychological Resources Act, in force since August 2025, prohibits providing, offering or advertising therapy or psychotherapy through AI unless a licensed professional is in charge of the service. The advertising clause is the part people miss: marketing an app as an AI therapist is itself treated as unlawful, with penalties running to five figures per violation. General wellness apps are exempt, which is the category most of these products actually fall into.",
      "Nevada took a similar line in Assembly Bill 406, barring AI from standing in for a counsellor or psychologist, and reaching into schools specifically.",
      "Utah went the other way. House Bill 452 did not ban anything. It requires a mental health chatbot to say plainly that it is software, at first contact, again when someone returns after a break, and any time they ask. It restricts what the product may advertise and what it may do with the data people hand over. Notably it offers a safe harbour: a provider that files a written compliance policy gets an affirmative defence against liability. That is the only constructive path any state has offered so far.",
      "California and New York took a fourth approach again, requiring crisis detection and backing it with a private right of action, which means an individual can sue rather than waiting for a regulator.",
      "The practical effect is a patchwork, and the honest summary is that the same product can be lawful in one state and not in the one next door. If you are using one of these tools, the thing worth knowing is not which law applies to you, it is what the tool does. Does it tell you it is software without being asked? Does it claim to treat anything? Does it know what to do when the conversation turns serious?",
      "We build to the strictest rule we know of rather than maintaining several versions of the truth. Aura tells you she is software without being asked. She does not present herself as a clinician, because she is not one. Every conversation passes through a crisis layer that routes to the emergency service for your country rather than trying to handle it alone.",
      "None of that is a legal opinion, and this article is not one either. It is a description of a landscape that changed quickly and is still moving. If you are somewhere with a restriction, take it seriously: the laws exist because products in this category caused harm, not because legislators were bored.",
    ],
  },
  {
    slug: "ai-therapy-crisis-gap",
    image: "/blog/ai-therapy-crisis-gap.svg",
    title: "The Question Chatbots Are Worst At",
    description:
      "Research shows AI models respond inconsistently to prompts about suicide. That is the most important failure in this category, and the one an AI mental health product has to design around rather than hope past.",
    publishedAt: "2026-09-16",
    readingMinutes: 7,
    related: [
      { slug: "what-therapists-say-about-ai-therapy", title: "What Therapists Say About AI Therapy" },
      { slug: "why-ai-therapy-forgets-you", title: "Why Every AI Therapy App Forgets You" },
    ],
    internalLinks: [
      { href: "/is-ai-therapy-safe", label: "How safety works here" },
      { href: "/features/crisis", label: "The crisis layer" },
      { href: "/ai-therapist-late-night", label: "An AI therapist at 2am" },
    ],
    body: [
      "There is a finding in the literature that anyone building in this space has to answer. When researchers put prompts relating to suicide in front of language models, both general-purpose ones and purpose-built mental health chatbots, the responses are inconsistent. Sometimes appropriate. Sometimes not. Not reliably either way.",
      "That is the worst possible place for a system to be unreliable, and it is not a problem you fix with a better prompt. A model that is right most of the time is not adequate when the exception is someone in danger.",
      "The design conclusion is that the model cannot be the safety mechanism. If the thing you are relying on to notice a crisis is the same thing that is generating the conversation, you have one point of failure doing two jobs, and the evidence says it will not do the second one reliably.",
      "So the crisis layer here sits outside the conversation. Every message is checked before and independently of what Aura is going to say, by a separate pass that does not depend on her having understood it correctly. It errs towards false positives, because the cost of asking someone if they are safe when they were not in danger is mild awkwardness, and the cost of the other error is not comparable.",
      "When it fires, the behaviour is fixed rather than generated. The hotline for your country is shown. It is shown whether or not the model would have thought to. The conversation slows down. Aura is instructed to stay, to ask directly and calmly, and to do nothing else until it is done. Escalation is sticky: once the tier has risen it does not quietly drop back because the next message sounded lighter.",
      "None of that makes this a crisis service, and the product says so in plain words. An AI cannot send anyone to your door. What it can do is refuse to be the thing that misses it, and hand over quickly to something that can.",
      "There is a version of this product that performs better in a demo by being warmer in exactly these moments and skipping the hotline because it interrupts the mood. That version is more pleasant to use and worse to rely on. This is the trade we made, and we would rather you knew we made it.",
      "If you are in danger right now, please contact your local emergency number. Not because of a policy, but because that is the thing that actually helps, and nothing on this page is a substitute for it.",
    ],
  },
  {
    slug: "what-ai-cannot-do-for-you",
    image: "/blog/what-ai-cannot-do-for-you.svg",
    title: "What an AI Cannot Do For You",
    description:
      "An honest list of the limits, from the company building one. Some of these are temporary engineering problems. Most of them are not, and it matters which is which.",
    publishedAt: "2026-09-16",
    readingMinutes: 6,
    related: [
      { slug: "what-therapists-say-about-ai-therapy", title: "What Therapists Say About AI Therapy" },
      { slug: "ai-therapy-crisis-gap", title: "The Question Chatbots Are Worst At" },
    ],
    internalLinks: [
      { href: "/ai-therapist-vs-human-therapist", label: "AI vs a human therapist" },
      { href: "/is-ai-therapy-effective", label: "Is AI therapy effective?" },
      { href: "/circles", label: "Circles: other people, anonymously" },
    ],
    body: [
      "Most writing about AI mental health tools is produced by people selling them, and it is mostly about what they can do. This is the other list. We build one of these, and this is what ours cannot do for you.",
      "It cannot be surprised by you. A therapist has a reaction, and part of what makes the room work is that a second nervous system is responding in real time to what you just said. Aura can name the feeling accurately. She is not having one.",
      "It cannot be in the world with you. It does not know that you sounded different today, that you have lost weight, that you flinched. Almost everything a skilled clinician notices arrives through a channel that text does not carry and that voice only partly does.",
      "It cannot hold a boundary the way a person does. If you want it to agree with you at three in the morning, a well-built one will push back, but you can always close the tab. A relationship you cannot leave by closing a tab does something different, and some of the work only happens because leaving is hard.",
      "It cannot get you help. It cannot call anyone, cannot come to you, and cannot tell someone who loves you that you are struggling. This is the limit that matters most and the one most easily forgotten at the moment it counts.",
      "It cannot treat anything. No diagnosis, no treatment plan, no clinical claim, and no evidence that using it improves any condition. Be sceptical of anyone in this category who tells you otherwise, including us if we ever do.",
      "Some limits are real but temporary. Memory was one: most products in this category still start from zero every session, and that is an engineering choice rather than a law of nature, which is why we fixed it. Language is another, and cost is another, and being awake at four in the morning is another. Those are the ones worth building against.",
      "The reason to be clear about the permanent list is that it tells you what this is for. Not a replacement for a person. Something that is there in the hours when no person is, that remembers what you told it, and that says plainly when the thing you need is not it.",
    ],
  },
  {
    slug: "why-ai-therapy-forgets-you",
    image: "/blog/why-ai-therapy-forgets-you.svg",
    title: "Why Every AI Therapy App Forgets You — And What That Actually Costs",
    description:
      "Most AI therapy products have no memory. Each session begins from zero. We unpack why that broken architecture exists, the human cost of repeating yourself, and how Calm AI Therapy solves it.",
    publishedAt: "2026-04-10",
    readingMinutes: 7,
    related: [
      { slug: "ai-therapy-crisis-gap", title: "The Question Chatbots Are Worst At" },
      { slug: "what-therapists-say-about-ai-therapy", title: "What Therapists Say About AI Therapy" },
      { slug: "ai-therapy-privacy", title: "Who Owns Your Mental Health Data?" },
    ],
    internalLinks: [
      { href: "/features/chat", label: "Chat Agent" },
      { href: "/how-it-works", label: "How Calm AI Therapy works" },
      { href: "/for/anxiety", label: "AI therapy for anxiety" },
    ],
    body: [
      "The single most painful thing about most AI therapy apps is the thing nobody talks about: every time you open one, you start over. The chatbot that asked you how you were yesterday has no idea who you are today. The conversation about your father — the one that took an hour and a half to write out, that you cried through — is gone. By the time you log back in, the bot is asking you, with the cheerful disregard of a stranger, how it can help.",
      "This is not an edge case. This is the architecture. Most AI therapy products are built on a stateless API call: your message in, a generic response out. There is no profile, no longitudinal record, no user-specific memory. The illusion of relationship is reset every session.",
      "It's worth asking why. The answer is partly technical — building a real memory layer is hard, expensive, and exposes the company to regulatory questions about what they're storing, where it lives, and what they can do with it. The answer is also partly economic — a stateless system scales infinitely; a stateful one requires individual context per user, which costs more to run and more to operate. So most builders quietly choose stateless and hope the users don't notice.",
      "But users notice. The thing that breaks trust in AI therapy isn't a bad response. It's the moment you realise the thing you spent forty minutes sharing has evaporated. The cost of that moment is enormous. People who already feel unseen by the world feel unseen by the tool that promised to see them. Many of them never come back.",
      "The cost is not just emotional. It is clinical. Therapy works in part because the therapist remembers. They remember your mother's name. They remember the recurring dream. They remember the pattern they noticed in week three that they want to test in week eight. Memory is not a feature of therapy — it is the substrate of therapy. A therapy product without memory is, definitionally, not doing therapy.",
      "Calm AI Therapy was built around this gap. The architecture is memory-first. Every session feeds a structured profile of the person you are: your relationships, your work, your values, your patterns, your goals. When you come back two weeks later, Calm AI Therapy already knows. It will say your sister's name. It will remember that Tuesday is your hardest day. It will follow up on the thing you said in passing.",
      "We built this because we believed memory was the missing piece, and everything we have seen since says so. People who are remembered come back, trust more, and surface the harder topics sooner. None of this is surprising. It is what should happen when a tool is built for actual humans.",
      "If you have been burned by an AI therapy product that forgot you, that betrayal is real. We will not tell you it was your fault. We will not tell you to try harder next time. We will tell you that there is now an alternative — one designed from first principles around the thing that should never have been optional in the first place. You deserve a tool that remembers you.",
    ],
  },
  {
    slug: "men-therapy-stigma",
    image: "/blog/men-therapy-stigma.svg",
    title: "The Reason Men Don't Go to Therapy — And Why AI Might Change That",
    description:
      "Men access mental health support at significantly lower rates than women. The gap isn't apathy — it's interface. We explore why, and how Calm AI Therapy's tone system was built to bridge it.",
    publishedAt: "2026-04-04",
    readingMinutes: 6,
    related: [
      { slug: "why-ai-therapy-forgets-you", title: "Why Every AI Therapy App Forgets You" },
      { slug: "what-ai-cannot-do-for-you", title: "What an AI Cannot Do For You" },
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
      "Calm AI Therapy was built to handle this directly. The tone system — warm, direct, or clinical — is not a cosmetic choice. It is structural. A user who selects \"direct\" gets a fundamentally different agent: one that skips the comfort, gets to the insight, and treats the user as a peer. Tone preferences influence the system prompt, the voice (in voice mode), the response length, and the question style. The result is a product that does not ask you to be vulnerable in language you don't speak.",
      "We also took a hard look at what men actually do when they're struggling. They walk. They drive. They pace. They do not, generally, sit down and write a journal entry about their feelings. Voice mode was designed for the people who would never type a single thing — but who, given a voice agent that does not condescend, will say a great deal.",
      "There's a deeper point here. The framing of \"men should be able to talk about feelings\" puts the burden on men to change. Calm AI Therapy takes a different position: the tools should change. If the tool meets you where you are — in tone, in modality, in time of day — then talking happens. We have seen it happen. Men who would have laughed at \"therapy\" use Calm AI Therapy daily.",
      "If you have been told for forty years that you don't need this, we are not here to convince you that you do. We are here to make a tool that, if you want to think out loud at 11pm in your car, you can. No appointment. No vulnerability budget. No therapeutic vocabulary. Just somewhere to put what is in your head — and someone, on the other side, who will remember it tomorrow.",
    ],
  },
  {
    slug: "ai-therapy-privacy",
    image: "/blog/ai-therapy-privacy.svg",
    title: "Who Owns Your Mental Health Data? What Every AI Therapy App Does With Your Pain",
    description:
      "Most AI therapy products treat your conversations as training data. We pull back the curtain on the privacy landscape and explain Calm AI Therapy's commitments — in plain language.",
    publishedAt: "2026-03-28",
    readingMinutes: 7,
    related: [
      { slug: "states-banning-ai-therapy", title: "The States That Restricted AI Therapy" },
      { slug: "what-therapists-say-about-ai-therapy", title: "What Therapists Say About AI Therapy" },
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
      "Calm AI Therapy was built around a different premise. We do not train on your conversations. We do not sell your data. We do not share it with third parties. These are not aspirational claims — they are architectural commitments, baked into the system. Sessions are encrypted. Memory is per-user and isolated. You can export everything you've ever said in one click. You can delete everything in one click. None of that is opt-in.",
      "We are aligned with HIPAA's data principles even where we are not legally required to be, because the people who use our product deserve at least that. We will publish our subprocessor list. We will publish our incident response policy. We do not bury data terms in 40 pages of ToS. The terms that matter are stated on a single page, in plain English.",
      "There is a broader question here about who builds these products. The teams behind some AI therapy apps are venture-funded with growth at any cost. The growth model often rewards engagement metrics that are at odds with user wellbeing — and it rewards data accumulation. Calm AI Therapy does not carry those incentives. There is no investor here expecting a return on your attention. We are not trying to maximise daily-active-users. We are trying to be useful.",
      "If you've ever paused before typing something into an AI tool because you weren't sure what would happen to it — that pause is wisdom. Most of the time, the right answer is: don't type it. Calm AI Therapy exists for the cases where the answer should be: it's safe here. We have committed to keeping that promise. The page that explains exactly how is one click from this article.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
