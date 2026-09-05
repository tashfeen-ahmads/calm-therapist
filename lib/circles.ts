import { dbEnabled, prisma } from "./prisma";
import { memberCount } from "./users";
import { CIRCLES_OPEN_AT, CIRCLE_THEME_SLUGS } from "./circle-themes";

/* Memory fallback for dev without a database. */
const globalAny = globalThis as unknown as { __calmCircleInterest?: Map<string, Set<string>> };
const memory = globalAny.__calmCircleInterest ?? new Map<string, Set<string>>();
globalAny.__calmCircleInterest = memory;

export interface CircleStats {
  members: number;
  openAt: number;
  /** Members who have picked at least one theme. */
  interested: number;
  /** How many members picked each theme, most wanted first. */
  themes: { slug: string; count: number }[];
}

export async function circleStats(): Promise<CircleStats> {
  const members = await memberCount();
  if (dbEnabled) {
    const [interestedRows, grouped] = await Promise.all([
      prisma.circleInterest.findMany({ distinct: ["userId"], select: { userId: true } }),
      prisma.circleInterest.groupBy({ by: ["theme"], _count: { theme: true }, orderBy: { _count: { theme: "desc" } } }),
    ]);
    return {
      members,
      openAt: CIRCLES_OPEN_AT,
      interested: interestedRows.length,
      themes: grouped.map((g) => ({ slug: g.theme, count: g._count.theme })),
    };
  }
  const counts = new Map<string, number>();
  for (const set of memory.values()) for (const t of set) counts.set(t, (counts.get(t) ?? 0) + 1);
  return {
    members,
    openAt: CIRCLES_OPEN_AT,
    interested: Array.from(memory.values()).filter((s) => s.size > 0).length,
    themes: Array.from(counts, ([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count),
  };
}

export async function listInterest(userId: string): Promise<string[]> {
  if (dbEnabled) {
    const rows = await prisma.circleInterest.findMany({ where: { userId }, select: { theme: true } });
    return rows.map((r) => r.theme);
  }
  return Array.from(memory.get(userId) ?? []);
}

/** Replaces the member's theme picks with the given set. Unknown slugs are dropped. */
export async function setInterest(userId: string, themes: string[]): Promise<string[]> {
  const clean = Array.from(new Set(themes.filter((t) => CIRCLE_THEME_SLUGS.has(t)))).slice(0, 10);
  if (dbEnabled) {
    await prisma.$transaction([
      prisma.circleInterest.deleteMany({ where: { userId, theme: { notIn: clean } } }),
      ...clean.map((theme) =>
        prisma.circleInterest.upsert({
          where: { userId_theme: { userId, theme } },
          create: { userId, theme },
          update: {},
        })
      ),
    ]);
    return clean;
  }
  memory.set(userId, new Set(clean));
  return clean;
}
