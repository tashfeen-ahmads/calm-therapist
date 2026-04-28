export type ModeKey = "chat" | "voice" | "journal" | "reflect" | "crisis";

export interface ModeDefinition {
  key: ModeKey;
  label: string;
  slug: string;
  oneLiner: string;
  longDescription: string;
  systemAddendum: string;
}

export const MODES: Record<ModeKey, ModeDefinition> = {
  chat: {
    key: "chat",
    label: "Chat Agent",
    slug: "chat",
    oneLiner: "Write when you're not ready to speak. Structured, safe, and always available.",
    longDescription:
      "The Chat Agent is the slowest, most deliberate way to talk to Calm Therapist. Type at your own pace. Re-read your own words. Let the conversation breathe.",
    systemAddendum:
      "You are in chat mode. Take time. Use longer, fuller responses (3-5 sentences). Reference past memories when relevant.",
  },
  voice: {
    key: "voice",
    label: "Voice Agent",
    slug: "voice",
    oneLiner: "Talk. Calm Therapist listens, reflects, and responds — like a conversation, not a form.",
    longDescription:
      "The Voice Agent is built for the moments you can't type — when anxiety makes your hands shake, when you're walking, when you just need to talk.",
    systemAddendum:
      "You are currently in voice mode. Keep responses to 2-3 sentences maximum so they work well as spoken audio. Avoid lists. Speak naturally.",
  },
  journal: {
    key: "journal",
    label: "Weekly Journal",
    slug: "journal",
    oneLiner: "A private space to track your week. Calm Therapist surfaces patterns you didn't notice.",
    longDescription:
      "Each week, Calm Therapist reviews what you wrote and what you talked about. It surfaces patterns and emotional themes — gently, without judgment.",
    systemAddendum:
      "You are reviewing this person's week with them. Your role is to surface patterns, name emotional themes, and highlight growth they may not have noticed themselves.",
  },
  reflect: {
    key: "reflect",
    label: "Monthly Reflect",
    slug: "reflect",
    oneLiner: "Every month, a summary of your growth. Real progress, not performance.",
    longDescription:
      "Monthly Reflect compares this month to the last. It shows you the shift — and reads back the things you said that you may have already forgotten.",
    systemAddendum:
      "You are conducting a monthly review. Be analytical. Identify shifts over time. Surface the user's own words back to them as evidence of their journey.",
  },
  crisis: {
    key: "crisis",
    label: "Crisis Safe",
    slug: "crisis",
    oneLiner: "When things get serious. Immediate grounding, and a real human if needed.",
    longDescription:
      "Crisis Safe mode skips the small talk. It grounds you in the present, surfaces the right resources for your region, and connects you to a human if you need one.",
    systemAddendum:
      "CRISIS MODE ACTIVE. This person may be in distress. Follow the crisis protocol strictly. Prioritise safety above all else. Do not attempt to continue therapeutic work until safety is established.",
  },
};

export const MODE_LIST: ModeDefinition[] = Object.values(MODES);
