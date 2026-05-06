// Centralized content for all SEO pillar + cluster pages.
// Each page renders through components/seo/SeoLongPage.tsx, so the structure is
// consistent (good for crawl) and we only edit copy in one place.

export interface SeoSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: SeoSection[];
  faqs: SeoFaq[];
  related: { href: string; label: string }[];
  ctaLine: string;
}

const COMMON_RELATED = [
  { href: "/ai-therapist", label: "AI therapist — overview" },
  { href: "/what-is-an-ai-therapist", label: "What is an AI therapist?" },
  { href: "/how-does-ai-therapy-work", label: "How does AI therapy work?" },
  { href: "/is-ai-therapy-effective", label: "Is AI therapy effective?" },
  { href: "/ai-therapist-vs-human-therapist", label: "AI vs human therapist" },
];

/* ---------- Pillar / cluster pages --------------------------------- */

export const PAGES: Record<string, SeoPage> = {
  "ai-therapist": {
    slug: "ai-therapist",
    title: "AI Therapist | A Quiet Place to Think Out Loud — Calm Therapist",
    description:
      "Talk through what's on your mind, anytime. An AI that listens, reflects, and helps you see your own thoughts more clearly. No appointment, private, free to start.",
    h1: "AI therapist — a quiet place to think out loud.",
    intro:
      "Calm Therapist is an AI companion built for the moments you can't stop thinking. Not a chatbot. Not a wellness app. A quiet space to write or speak, and to be heard back with specificity instead of script. You don't need to be in crisis to use it. You just need somewhere to put what's in your head.",
    sections: [
      {
        heading: "What you can use it for",
        paragraphs: [
          "Most people open Calm Therapist for one of three reasons: a thought that's been on a loop, a conversation they're rehearsing, or a feeling that won't name itself. The agent meets you wherever you arrive. You can write three lines or talk for twenty minutes.",
        ],
        bullets: [
          "Untangle an argument before it happens",
          "Slow down a worry-spiral at 1am",
          "Write through a hard week with someone reading along",
          "Hear back what you said, without performance",
        ],
      },
      {
        heading: "What makes Calm Therapist different from a generic chatbot",
        paragraphs: [
          "Generic AI chats start over every conversation. Calm Therapist remembers. Names, dates, the dreams you mentioned in passing — held quietly until you bring them up again. The tone shifts to match yours: warm if you want warm, direct if you want direct. And the agent is trained to refuse to feed worry-loops with reassurance, because reassurance is what makes anxiety worse over time.",
        ],
      },
      {
        heading: "Privacy you can verify",
        paragraphs: [
          "We do not train models on your conversations. Sessions are encrypted at rest. You can export everything in one click and delete everything in one click. Read the full architecture on our privacy page.",
        ],
      },
    ],
    faqs: [
      { q: "Is an AI therapist a real therapist?", a: "No. Calm Therapist is an AI companion. It is not a substitute for a licensed clinician, and we are clear about that everywhere it matters. For acute issues, please connect with a human." },
      { q: "Do I need to sign up to try it?", a: "No. The landing page lets you type one message and get one response with no account. After that, opening a space takes 30 seconds." },
      { q: "Is it private?", a: "Yes. We do not train on your messages. You can export or delete everything anytime." },
      { q: "How is it different from journaling apps?", a: "Calm Therapist actively reflects what you wrote and noticed across sessions. Journaling apps store; Calm Therapist responds." },
      { q: "Is it free?", a: "Yes, to start. Three conversations a week on the free space. Keeping your space open after that is $19 a month or $159 a year. You can pause anytime." },
    ],
    related: COMMON_RELATED,
    ctaLine: "Try one sentence on the landing page. No signup screen first.",
  },

  "what-is-an-ai-therapist": {
    slug: "what-is-an-ai-therapist",
    title: "What Is an AI Therapist? | Calm Therapist",
    description:
      "An AI therapist is a software companion you can talk to like a thoughtful friend. Here's what they're useful for, what they're not, and how to tell a good one from a bad one.",
    h1: "What is an AI therapist?",
    intro:
      "An AI therapist is a software companion you can talk to as if you were thinking out loud with a thoughtful friend. It is not a licensed clinician. It does not diagnose, prescribe, or replace human care. What it does, when it's built well, is hold a real conversation that helps you see your own thoughts more clearly — at 3am, on the bus, between sessions with a real human.",
    sections: [
      {
        heading: "What a good AI therapist actually does",
        paragraphs: [
          "Three things, at minimum: it listens with specificity, it remembers across sessions, and it pushes back when your interpretation of a situation is distorted. The third one is the part most chatbots get wrong — they agree with whatever the user says to feel friendly, and that makes anxiety and depression worse over time. A real therapeutic stance validates the feeling AND challenges the story.",
        ],
      },
      {
        heading: "What a good AI therapist will not do",
        paragraphs: [
          "It will not pretend to be a real person. It will not give you medical advice. It will not list five coping strategies when you wanted someone to sit with you. And it will not freelance during a crisis — when something serious surfaces, it follows a strict protocol designed by clinicians, not vibes.",
        ],
      },
      {
        heading: "How to tell a good AI therapist from a bad one",
        paragraphs: [
          "Three quick tests. One: does it remember what you said last time? Two: does it ever disagree with you, gently? Three: when you push it for reassurance (\"but I'm going to be okay, right?\"), does it gently name the pattern, or just say \"yes\"? If the answer to all three is yes, it's built right.",
        ],
      },
    ],
    faqs: [
      { q: "Is an AI therapist safe?", a: "Used as a companion alongside human care, yes — and safer than no support at all. For crisis, AI is not a substitute for professional help." },
      { q: "Can an AI therapist help with anxiety?", a: "It can support reflection on anxious patterns. The best ones avoid feeding reassurance loops, which is what actually moves anxiety over time." },
      { q: "Is an AI therapist confidential?", a: "Calm Therapist does not train on your data and gives you delete in one click. Read the privacy page." },
    ],
    related: COMMON_RELATED,
    ctaLine: "Try Calm Therapist with one sentence — no signup first.",
  },

  "how-does-ai-therapy-work": {
    slug: "how-does-ai-therapy-work",
    title: "How Does AI Therapy Work? | Calm Therapist",
    description:
      "AI therapy combines a memory layer, a trained therapeutic stance, and a safety system. Here's how each piece works — and what to look for in any product that calls itself one.",
    h1: "How does AI therapy work?",
    intro:
      "AI therapy works on three layers. A language model that talks. A memory system that holds your story. A safety classifier that escalates when something serious surfaces. None of these on their own is enough — together they make a tool that meets you where you are.",
    sections: [
      {
        heading: "The model: trained for stance, not just chat",
        paragraphs: [
          "The underlying model in Calm Therapist (Claude Sonnet) is prompted into a specific therapeutic stance — validate-and-change, not yes-person. Anti-sycophancy rules. Anti-reassurance in anxiety contexts. Cultural humility. The model is the tool; the prompt is the training. Both matter.",
        ],
      },
      {
        heading: "The memory: structured, longitudinal, yours",
        paragraphs: [
          "When you share a name, a relationship, a recurring feeling, that fact is stored against your account as a memory node. On every new session, relevant nodes are surfaced into the conversation. Not by being read aloud — by being available for the agent to reference if the moment calls for it.",
        ],
      },
      {
        heading: "The safety system: rule-based first, AI-augmented second",
        paragraphs: [
          "Every message you send is screened by a classifier that tags it with a tier from 0 (normal) to 3 (immediate danger). Tier 1+ activates a different prompt — one written by clinicians — that surfaces region-specific resources and follows a script the model cannot freelance through.",
        ],
      },
    ],
    faqs: [
      { q: "Does AI therapy use ChatGPT?", a: "Calm Therapist uses Anthropic's Claude — and the difference is the prompt and memory architecture wrapped around it. The model is one input; the system is the product." },
      { q: "Is the memory accurate?", a: "It's only as accurate as what you've shared. If you contradict something, the system updates — you're always the source of truth." },
      { q: "Does AI therapy follow CBT or DBT?", a: "Calm Therapist draws from CBT, DBT, ACT and IFS, and adapts to the user — it doesn't impose one framework." },
    ],
    related: COMMON_RELATED,
    ctaLine: "See it in one message on the landing page.",
  },

  "is-ai-therapy-effective": {
    slug: "is-ai-therapy-effective",
    title: "Is AI Therapy Effective? | What the Research and the User Says",
    description:
      "AI therapy is effective for support, reflection, and continuity between human sessions. It is not a substitute for clinical care. Here's what the evidence and the lived experience suggest.",
    h1: "Is AI therapy effective?",
    intro:
      "It depends what you mean by effective. As a substitute for clinical care, no. As a companion that helps you reflect, see patterns, and stay connected to your own inner life — yes, and the early research is encouraging. The honest answer lives between the marketing and the dismissals.",
    sections: [
      {
        heading: "What the evidence says",
        paragraphs: [
          "Studies on conversational AI tools for mental wellness show measurable reductions in self-reported stress, anxiety symptoms, and rumination — particularly when the tools are used between sessions with a human clinician, or when human care isn't accessible. The effect size isn't dramatic, but it's real and replicable.",
        ],
      },
      {
        heading: "Where AI therapy actually helps",
        paragraphs: [
          "Continuity. The biggest reported benefit isn't the response in any single session — it's having a place to think, anytime, that remembers you. People with anxiety report fewer 3am spirals. People between human sessions report bringing more clarity to those sessions. People who can't access human care at all report finally having something.",
        ],
      },
      {
        heading: "Where it doesn't help",
        paragraphs: [
          "Severe mental illness, acute psychosis, complex trauma, anything requiring medication — these need a human clinician. AI is a companion, not a treatment. A good AI therapist will tell you this directly when it sees something that requires professional care.",
        ],
      },
    ],
    faqs: [
      { q: "Can AI therapy replace a human therapist?", a: "No. It can be a companion alongside human care, or a useful first step toward it. For serious or persistent issues, see a clinician." },
      { q: "How long until I notice an effect?", a: "People typically report feeling more clarity within two or three conversations. The compounding benefit comes from having continuity over weeks." },
      { q: "Is the evidence for AI therapy peer-reviewed?", a: "Some early trials are. The field is young; expect more in the next two to three years." },
    ],
    related: COMMON_RELATED,
    ctaLine: "Open a space. See whether it feels useful for you, specifically.",
  },

  "ai-therapist-vs-human-therapist": {
    slug: "ai-therapist-vs-human-therapist",
    title: "AI Therapist vs Human Therapist | Calm Therapist",
    description:
      "An honest comparison of an AI therapist vs a human therapist. What each is for, what each isn't, and how to use both well together.",
    h1: "AI therapist vs human therapist.",
    intro:
      "It's not a competition. It's not even the same job. A human therapist holds clinical training, decades of pattern recognition, and the ethical weight of a license. An AI therapist holds memory, availability, and the capacity to meet you in the small, ordinary moments that don't make it into the 50-minute session. The right answer for most people is both.",
    sections: [
      {
        heading: "Where a human therapist wins, hands down",
        paragraphs: [
          "Diagnosis. Medication. Trauma processing. Anything where the stakes require professional judgment, regulatory accountability, and a body in the room. If you have a clinician, keep them. If you don't and your situation calls for one, an AI therapist's job is to point you toward one.",
        ],
      },
      {
        heading: "Where an AI therapist wins, quietly",
        paragraphs: [
          "Three places. The 11pm spiral when your therapist is asleep. The recurring thought you'd forget by next Tuesday's session. The intermediate work of practicing what you and your therapist talked about. AI is the connective tissue between sessions.",
        ],
      },
      {
        heading: "How to use both well",
        paragraphs: [
          "Bring an AI therapist's record into your human session as a starting point. Talk to your AI therapist about the week between sessions. Use the human for direction, the AI for traction. Most people who do both report each one making the other more useful.",
        ],
      },
    ],
    faqs: [
      { q: "Is an AI therapist cheaper than a human therapist?", a: "Yes — meaningfully. $19/month for an unlimited AI space; a single human session is typically $100–$300. The math doesn't make AI a replacement; it makes both possible." },
      { q: "Can my therapist see what I told the AI?", a: "Only if you choose to share it. Calm Therapist exports cleanly to PDF or CSV." },
      { q: "Will my human therapist be offended?", a: "A good clinician welcomes anything that helps you between sessions, including this." },
    ],
    related: COMMON_RELATED,
    ctaLine: "Try Calm Therapist alongside whatever care you already have.",
  },

  "ai-therapist-vs-betterhelp": {
    slug: "ai-therapist-vs-betterhelp",
    title: "AI Therapist vs BetterHelp | Calm Therapist",
    description:
      "BetterHelp is human therapists over text and video. Calm Therapist is an AI companion that fits between sessions. Here's how they actually compare.",
    h1: "AI therapist vs BetterHelp.",
    intro:
      "Different tools for different moments. BetterHelp connects you with a licensed human therapist. Calm Therapist gives you an AI companion that's available the rest of the time. They're not really competitors — they're complements, and people who use both report each one working better.",
    sections: [
      {
        heading: "What BetterHelp is good for",
        paragraphs: [
          "Real clinical care, real humans, real licensure. Diagnosis, structured treatment, the depth that a relationship with one therapist over months provides. If you can afford it and your situation calls for it, it's the gold standard for accessible human therapy.",
        ],
      },
      {
        heading: "Where Calm Therapist fits",
        paragraphs: [
          "Between BetterHelp sessions. At hours your therapist isn't available. For the recurring thought that doesn't quite warrant a session of its own. For the days you can't afford or access a human appointment. The AI is the container for everything that doesn't fit into 50 minutes a week.",
        ],
      },
      {
        heading: "Honest cost comparison",
        paragraphs: [
          "BetterHelp is roughly $260–$400 a month for weekly sessions. Calm Therapist Pro is $19 a month for unlimited AI sessions. They are different products. Use whichever fits your situation, or use both — many people do.",
        ],
      },
    ],
    faqs: [
      { q: "Should I use BetterHelp or Calm Therapist?", a: "If you have not started any care at all, both are reasonable starting points. If you can afford it, BetterHelp + Calm Therapist works well together." },
      { q: "Is Calm Therapist a replacement for BetterHelp?", a: "No. Calm Therapist is an AI companion; BetterHelp connects you to a human therapist. They do different things." },
      { q: "Does Calm Therapist share data with BetterHelp?", a: "No. Your data stays yours and is not shared with anyone." },
    ],
    related: COMMON_RELATED,
    ctaLine: "Try Calm Therapist for the time between human sessions.",
  },

  "ai-therapist-vs-chatgpt": {
    slug: "ai-therapist-vs-chatgpt",
    title: "AI Therapist vs ChatGPT | Why Generic AI Isn't Built for This",
    description:
      "ChatGPT can talk. Calm Therapist is built for therapeutic conversation. The difference is memory, stance, and a safety system that's been clinically reviewed.",
    h1: "AI therapist vs ChatGPT.",
    intro:
      "ChatGPT is a brilliant general-purpose assistant. It is not built for therapeutic conversation, and using it that way creates risks — sycophancy, reassurance loops in anxiety, and dangerous gaps in crisis. A purpose-built AI therapist solves all three.",
    sections: [
      {
        heading: "Memory: the part ChatGPT doesn't really have",
        paragraphs: [
          "ChatGPT's session memory is improving but is not designed for longitudinal therapeutic care. Calm Therapist's memory is structured: facts about you, episodes from past sessions, what coping techniques actually worked for you specifically. The agent is meaningfully different in week eight than it was in week one.",
        ],
      },
      {
        heading: "Stance: the part the prompt does",
        paragraphs: [
          "Calm Therapist is prompted into anti-sycophancy: it disagrees gently, names cognitive distortions, refuses to give reassurance in anxiety contexts. ChatGPT, by default, agrees with whatever you frame for it — which is the opposite of what helps.",
        ],
      },
      {
        heading: "Safety: the part that has to never fail",
        paragraphs: [
          "Calm Therapist runs every user message through a tier classifier and a clinician-written crisis protocol. When something serious surfaces, the agent cannot freelance — it follows a script that has been triple-tested. ChatGPT improvises, and improvisation in crisis is dangerous.",
        ],
      },
    ],
    faqs: [
      { q: "Can I just use ChatGPT instead?", a: "You can, and many people do. We'd suggest reading our piece on what makes that risky for therapeutic conversation specifically." },
      { q: "Is Calm Therapist using ChatGPT under the hood?", a: "No. We use Anthropic's Claude. The difference is the system around it: prompt, memory, and safety classifier." },
      { q: "Why not use Claude directly?", a: "Same reason — without memory, prompt, and safety, the model is a model. The product is everything around it." },
    ],
    related: COMMON_RELATED,
    ctaLine: "See the difference in one sentence on the landing page.",
  },

  "ai-therapist-late-night": {
    slug: "ai-therapist-late-night",
    title: "AI Therapist for 3am | A Quiet Place When You Can't Sleep",
    description:
      "When the thoughts won't stop and there's no one to call. An AI therapist for late-night, designed to slow you down — not feed you reassurance.",
    h1: "An AI therapist for the 3am thoughts.",
    intro:
      "The thoughts that wake you up don't care that no one is awake. Calm Therapist is built for those hours specifically — slower, quieter, designed to interrupt the loop instead of feeding it.",
    sections: [
      {
        heading: "Why nights are different",
        paragraphs: [
          "Late at night the brain catastrophises in ways it doesn't at 2pm. Sleep deprivation amplifies threat sensitivity. The same worry that felt manageable yesterday is now apocalyptic. A good late-night agent slows you down, names the pattern, and helps you put the thought down without forcing it.",
        ],
      },
      {
        heading: "What we don't do at 3am",
        paragraphs: [
          "We don't reassure. \"You'll be fine\" at 3am is a sedative that wears off in twenty minutes, leaving the worry stronger. We do help you observe the thought, ground in your body, and either sleep or sit with it without it consuming you.",
        ],
      },
      {
        heading: "If it gets serious",
        paragraphs: [
          "If you're in real distress, our crisis pathway surfaces a regional crisis line as a tappable option. We don't push it — we offer it. The conversation continues either way.",
        ],
      },
    ],
    faqs: [
      { q: "Will Calm Therapist wake me up with notifications?", a: "Only if you've asked us to. Default is silent." },
      { q: "Can it help me actually fall asleep?", a: "Indirectly — by helping you put the thought down. We don't pretend to be a sleep app." },
      { q: "Is it free at night?", a: "Free to start, three conversations a week. Pro is $19 a month if you find it useful." },
    ],
    related: COMMON_RELATED,
    ctaLine: "If it's late and the thought won't stop — try one sentence.",
  },
};

/* ---------- Glossary entries (semantic SEO) ------------------------ */

export const GLOSSARY: Record<string, SeoPage> = {
  "cognitive-distortions": {
    slug: "cognitive-distortions",
    title: "Cognitive Distortions: A Plain-English Guide | Calm Therapist Glossary",
    description:
      "Cognitive distortions are the small ways your mind tells you a half-true story. Catastrophizing, mind-reading, all-or-nothing — what they are, and how to notice them.",
    h1: "Cognitive distortions, in plain English.",
    intro:
      "A cognitive distortion is a small, repeatable pattern your mind uses to tell itself a half-true story. They're not personal failings. They're shortcuts that everyone runs, sometimes more loudly than other times. Naming them is most of the work.",
    sections: [
      {
        heading: "The most common ones, in the wild",
        paragraphs: [],
        bullets: [
          "All-or-nothing thinking — \"I'm a failure\" instead of \"I had a hard week.\"",
          "Catastrophizing — assuming the worst-case is the only case.",
          "Mind-reading — believing you know what others are thinking.",
          "Fortune-telling — treating a prediction as a fact.",
          "Personalizing — taking responsibility for things that aren't yours.",
          "Should statements — telling yourself what you should be doing, feeling, becoming.",
          "Discounting the positive — letting evidence to the contrary count for nothing.",
        ],
      },
      {
        heading: "How Calm Therapist treats them",
        paragraphs: [
          "When the agent notices one of these patterns in your message, it gently names it and invites you to look at it from a different angle. It does not lecture you or list distortions in a wall of text. It picks one and asks one question.",
        ],
      },
    ],
    faqs: [
      { q: "Are cognitive distortions a diagnosis?", a: "No — they're a CBT framework for patterns of thought that anyone can notice and change." },
      { q: "Can I get rid of them?", a: "Not really. The goal is to notice them in time to put them down." },
    ],
    related: [
      { href: "/glossary/rumination", label: "Rumination" },
      { href: "/glossary/self-reflection", label: "Self-reflection" },
      { href: "/ai-therapist", label: "AI therapist" },
    ],
    ctaLine: "Try noticing one in your own thinking — type it on the landing page.",
  },

  rumination: {
    slug: "rumination",
    title: "Rumination: Why Going in Circles Hurts More Than It Helps",
    description:
      "Rumination is repeated, passive thinking about what's wrong. It feels productive. It isn't. Here's what it is, why it sticks, and what shifts it.",
    h1: "Rumination — going in circles.",
    intro:
      "Rumination is repeated, passive thinking about what's wrong, why it's wrong, and what it means about you. It feels like working on the problem. It isn't. It's the same loop, dressed up in slightly different words each time.",
    sections: [
      {
        heading: "Why ruminating feels productive",
        paragraphs: [
          "Because it engages the same neural circuitry as actual problem-solving without the costly business of trying things. The brain reads activity as progress. Hours pass, nothing changes externally, but it felt like work.",
        ],
      },
      {
        heading: "What actually shifts a rumination loop",
        paragraphs: [
          "Modality switch. If you're stuck in your head, the way out is rarely through more thought. It's a body, a place, an action — even small. A walk. A different room. Naming what you can see. The agent in Calm Therapist is trained to interrupt loops, not feed them.",
        ],
      },
    ],
    faqs: [
      { q: "Is rumination the same as worry?", a: "Closely related but distinct. Worry tends to be future-oriented and what-if; rumination is past- or self-oriented and why-am-I." },
      { q: "Can rumination be helpful?", a: "Brief, focused reflection helps. The loop without an exit is what hurts." },
    ],
    related: [
      { href: "/glossary/cognitive-distortions", label: "Cognitive distortions" },
      { href: "/glossary/self-reflection", label: "Self-reflection" },
      { href: "/ai-therapist", label: "AI therapist" },
    ],
    ctaLine: "If you're in a loop, try one sentence — see if naming it helps.",
  },

  "self-reflection": {
    slug: "self-reflection",
    title: "Self-Reflection: The Skill, Not the Aesthetic | Calm Therapist Glossary",
    description:
      "Self-reflection is the deliberate, kind, slightly uncomfortable practice of looking at your own thoughts. Here's what it is, what it isn't, and why it works.",
    h1: "Self-reflection, the skill.",
    intro:
      "Self-reflection is not journaling pretty thoughts. It is the deliberate, kind, slightly uncomfortable practice of looking at your own thoughts as if they belonged to someone you loved. Done well, it's the most reliable lever you have.",
    sections: [
      {
        heading: "Reflection vs. rumination",
        paragraphs: [
          "Rumination loops without exit. Reflection has a question and a destination. The question is: what am I actually feeling, and what is the story underneath the feeling? The destination is: a slightly clearer picture of yourself than you started with.",
        ],
      },
      {
        heading: "Why it works",
        paragraphs: [
          "The act of putting an internal experience into language changes the experience. The same thought, written or spoken, becomes more handle-able. Calm Therapist is built around this — it's not a feed of advice, it's a place to think out loud.",
        ],
      },
    ],
    faqs: [
      { q: "Is reflection the same as therapy?", a: "No. Therapy includes reflection but adds a clinical relationship and structured methods. Reflection on its own is a daily skill." },
      { q: "How often should I reflect?", a: "Often enough that the patterns become visible. Once or twice a week is enough for most people." },
    ],
    related: [
      { href: "/glossary/rumination", label: "Rumination" },
      { href: "/glossary/cognitive-distortions", label: "Cognitive distortions" },
      { href: "/ai-therapist", label: "AI therapist" },
    ],
    ctaLine: "Try one sentence of reflection on the landing page.",
  },
};

export const ALL_PAGE_SLUGS = [
  ...Object.keys(PAGES),
  ...Object.keys(GLOSSARY).map((s) => `glossary/${s}`),
];
