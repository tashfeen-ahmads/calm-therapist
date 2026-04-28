export interface MemoryNode {
  id: string;
  statement: string;
  category: "family" | "work" | "health" | "relationship" | "pattern" | "goal" | "value";
  firstMentioned: string;
  mentions: number;
  lastMentioned: string;
}

const STORAGE_KEY = "calm-therapist:memories";

export function loadMemories(): MemoryNode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_MEMORIES;
    return JSON.parse(raw) as MemoryNode[];
  } catch {
    return SEED_MEMORIES;
  }
}

export function saveMemories(memories: MemoryNode[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
}

export function buildMemoryContext(memories: MemoryNode[], limit = 20): string {
  return [...memories]
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, limit)
    .map((m) => m.statement)
    .join("\n");
}

export function appendMemory(memories: MemoryNode[], statement: string, category: MemoryNode["category"]): MemoryNode[] {
  const now = new Date().toISOString();
  return [
    ...memories,
    {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      statement,
      category,
      firstMentioned: now,
      lastMentioned: now,
      mentions: 1,
    },
  ];
}

export const SEED_MEMORIES: MemoryNode[] = [
  {
    id: "seed_1",
    statement: "You mentioned your father passed away in March.",
    category: "family",
    firstMentioned: "2026-03-12T10:00:00.000Z",
    lastMentioned: "2026-04-20T14:30:00.000Z",
    mentions: 6,
  },
  {
    id: "seed_2",
    statement: "You work in tech and find the pace overwhelming.",
    category: "work",
    firstMentioned: "2026-02-04T19:00:00.000Z",
    lastMentioned: "2026-04-22T09:15:00.000Z",
    mentions: 11,
  },
  {
    id: "seed_3",
    statement: "You've described Tuesdays as consistently your worst day.",
    category: "pattern",
    firstMentioned: "2026-02-25T07:30:00.000Z",
    lastMentioned: "2026-04-15T08:00:00.000Z",
    mentions: 4,
  },
  {
    id: "seed_4",
    statement: "Your sister is going through a divorce and you feel responsible for holding her together.",
    category: "relationship",
    firstMentioned: "2026-03-02T20:00:00.000Z",
    lastMentioned: "2026-04-26T21:00:00.000Z",
    mentions: 7,
  },
  {
    id: "seed_5",
    statement: "You sleep best on the nights you walk after dinner.",
    category: "pattern",
    firstMentioned: "2026-03-14T22:00:00.000Z",
    lastMentioned: "2026-04-23T22:00:00.000Z",
    mentions: 5,
  },
];
