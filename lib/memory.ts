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
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MemoryNode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMemories(memories: MemoryNode[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch {}
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

/**
 * Demo memories are gone. A new member starts with none; Aura earns them.
 * Kept as an empty export so older imports keep compiling.
 */
export const SEED_MEMORIES: MemoryNode[] = [];
