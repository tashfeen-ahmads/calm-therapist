/**
 * The circle theme library, and the numbers the product talks about.
 * Circles open when CIRCLES_OPEN_AT members have joined. Until then, members
 * pick the themes they would join so the first nights are planned from real
 * demand, not guesses.
 */
export const CIRCLES_OPEN_AT = Number(process.env.NEXT_PUBLIC_CIRCLES_OPEN_AT ?? 50);
export const CIRCLE_MINUTES = 45;
export const CIRCLE_SEATS = 8;

export interface CircleTheme {
  slug: string;
  title: string;
  line: string;
}

export const CIRCLE_THEMES: CircleTheme[] = [
  { slug: "saying-no-to-family", title: "Saying no to family", line: "When every no feels like a betrayal." },
  { slug: "overthinking-at-night", title: "Overthinking at night", line: "The 2am loop that will not close." },
  { slug: "guilt-about-resting", title: "Guilt about resting", line: "Stopping feels like failing." },
  { slug: "sunday-dread", title: "The Sunday dread", line: "The week arrives before it starts." },
  { slug: "comparison", title: "Comparison with cousins and peers", line: "Everyone else seems further along." },
  { slug: "putting-everyone-first", title: "Putting everyone first", line: "Being needed, and disappearing." },
  { slug: "anger-at-parents", title: "Anger you cannot show your parents", line: "Love and fury in the same room." },
  { slug: "far-from-home", title: "Being far from home", line: "Two places, fully in neither." },
  { slug: "money-guilt", title: "Money guilt", line: "Spending on yourself, sending it back." },
  { slug: "starting-over", title: "Starting over", line: "New city, new job, new you, same fears." },
];

export const CIRCLE_THEME_SLUGS = new Set(CIRCLE_THEMES.map((t) => t.slug));

/** Rules every member sees once before their first circle. */
export const CIRCLE_RULES = [
  "You are an anonymous animal in the room. Nobody sees your name or profile.",
  "Share from your own experience. No advice, no fixing, no medication talk.",
  "No methods, no contact details, no screenshots, no recruiting to other groups.",
  "Aura hosts and keeps time. A human moderator is on call for every circle.",
  "Leave any time. Report any message. Block anyone from future circles with you.",
];

const ANIMALS = [
  "Lizard", "Heron", "Otter", "Fox", "Badger", "Moth", "Owl", "Hare", "Wren", "Seal",
  "Lynx", "Finch", "Deer", "Crane", "Newt", "Stoat", "Robin", "Tortoise", "Swift", "Vole",
];

/** Deterministic preview of the anonymous name a member would get, from any string. */
export function anonymousAnimal(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `Anonymous ${ANIMALS[h % ANIMALS.length]}`;
}
