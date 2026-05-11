/**
 * Lightweight rule-based safety classifier. This is the first-pass tier.
 * For production, layer a fast LLM call (Haiku) on top to catch metaphor
 * and context. The pipeline always errs on the side of escalation.
 */

import Anthropic from "@anthropic-ai/sdk";

export type CrisisTier = 0 | 1 | 2 | 3;
export type CrisisCategory =
  | "none"
  | "passive_ideation"
  | "active_ideation"
  | "plan_or_imminent"
  | "harm_to_others"
  | "abuse_disclosure"
  | "psychosis_signs"
  | "disordered_eating"
  | "self_harm_non_suicidal";
export type Route =
  | "normal"
  | "tier1_script"
  | "tier2_script"
  | "tier3_script"
  | "harm_others_script"
  | "abuse_script"
  | "psychosis_script"
  | "ed_script";

export interface SafetyResult {
  tier: CrisisTier;
  category: CrisisCategory;
  confidence: number;
  triggerPhrases: string[];
  metaphorFlagged: boolean;
  route: Route;
}

const TIER3 = [
  // imminent / plan / means — leave this list intentionally short and
  // non-graphic. We do NOT enumerate methods anywhere in the codebase.
  /\b(tonight|right now|today)\b.*\b(end\s+(it|my\s+life)|kill\s+myself|take\s+my\s+life)\b/i,
  /\b(have|got|holding)\b.*\b(plan|note|means)\b.*\b(end|kill|die)\b/i,
  /\bgoing\s+to\s+(end|kill)\s+myself\b/i,
];

const TIER2 = [
  /\b(want\s+to\s+(die|disappear|not\s+be\s+here)|end\s+it|end\s+my\s+life|kill\s+myself|suicidal)\b/i,
  /\bi\s*can'?t\s+do\s+this\s+anymore\b/i,
  /\bno\s+(reason|point)\s+(to\s+)?live\b/i,
];

const TIER1 = [
  /\b(everyone\s+would\s+be\s+better\s+off|wish\s+i\s+(was|were)\s+(dead|gone))\b/i,
  /\b(don'?t\s+want\s+to\s+wake\s+up|ready\s+to\s+go|just\s+want\s+it\s+to\s+stop)\b/i,
];

const HARM_OTHERS = [
  /\b(want\s+to\s+(hurt|kill)|going\s+to\s+(hurt|kill))\b.*\b(him|her|them|my\s+(partner|husband|wife|kid|child))\b/i,
];

const ABUSE = [
  /\b(he|she|they)\s+(hits|hit|beat|chokes|threatens)\s+me\b/i,
  /\bi'?m\s+(scared|afraid)\s+of\s+(him|her|them)\b/i,
  /\bcontrols?\s+(my|the)\s+(money|phone|food|access)\b/i,
];

const PSYCHOSIS = [
  /\b(voices?\s+telling\s+me|they'?re\s+watching\s+me|government\s+(implanted|tracking))\b/i,
];

const ED = [
  /\b(haven'?t\s+eaten|throwing\s+up\s+after|purged|restricting\s+to\s+\d+)\b/i,
];

const SELF_HARM_NSSI = [
  /\b(cutting\s+myself|self.?harm(ing)?|burning\s+myself)\b/i,
];

function matchAny(re: RegExp[], s: string): string | null {
  for (const r of re) {
    const m = s.match(r);
    if (m) return m[0];
  }
  return null;
}

export function classifySafety(message: string): SafetyResult {
  const text = message ?? "";
  const triggers: string[] = [];

  // Highest priority first.
  const t3 = matchAny(TIER3, text);
  if (t3) {
    return {
      tier: 3,
      category: "plan_or_imminent",
      confidence: 0.85,
      triggerPhrases: [t3],
      metaphorFlagged: false,
      route: "tier3_script",
    };
  }

  const harm = matchAny(HARM_OTHERS, text);
  if (harm) {
    return {
      tier: 3,
      category: "harm_to_others",
      confidence: 0.8,
      triggerPhrases: [harm],
      metaphorFlagged: false,
      route: "harm_others_script",
    };
  }

  const psychosis = matchAny(PSYCHOSIS, text);
  if (psychosis) {
    return {
      tier: 3,
      category: "psychosis_signs",
      confidence: 0.7,
      triggerPhrases: [psychosis],
      metaphorFlagged: false,
      route: "psychosis_script",
    };
  }

  const abuse = matchAny(ABUSE, text);
  if (abuse) {
    return {
      tier: 2,
      category: "abuse_disclosure",
      confidence: 0.75,
      triggerPhrases: [abuse],
      metaphorFlagged: false,
      route: "abuse_script",
    };
  }

  const t2 = matchAny(TIER2, text);
  if (t2) {
    return {
      tier: 2,
      category: "active_ideation",
      confidence: 0.7,
      triggerPhrases: [t2],
      metaphorFlagged: false,
      route: "tier2_script",
    };
  }

  const ed = matchAny(ED, text);
  if (ed) {
    return {
      tier: 2,
      category: "disordered_eating",
      confidence: 0.65,
      triggerPhrases: [ed],
      metaphorFlagged: false,
      route: "ed_script",
    };
  }

  const nssi = matchAny(SELF_HARM_NSSI, text);
  if (nssi) {
    return {
      tier: 2,
      category: "self_harm_non_suicidal",
      confidence: 0.7,
      triggerPhrases: [nssi],
      metaphorFlagged: false,
      route: "tier2_script",
    };
  }

  const t1 = matchAny(TIER1, text);
  if (t1) {
    return {
      tier: 1,
      category: "passive_ideation",
      confidence: 0.6,
      triggerPhrases: [t1],
      metaphorFlagged: false,
      route: "tier1_script",
    };
  }

  return {
    tier: 0,
    category: "none",
    confidence: 1.0,
    triggerPhrases: triggers,
    metaphorFlagged: false,
    route: "normal",
  };
}

/* ------------------------------------------------------------------ */
/* LLM second pass — catches metaphor + context the regex misses.     */
/* Opt-in via CRISIS_LLM_PASS=on. Only runs when regex returns tier 0 */
/* (we trust the regex to escalate; LLM only ever pulls UP, never DOWN).*/
/* ------------------------------------------------------------------ */

let _haiku: Anthropic | null = null;
function haiku(): Anthropic {
  if (!_haiku) _haiku = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _haiku;
}

const LLM_SAFETY_PROMPT = `You are a safety classifier for a mental-wellness app. Output JSON only.

Given the user's message, return one of:
- {"tier":0} — ordinary content, no concern
- {"tier":1} — passive ideation, hopelessness, low-level self-harm hints (no clear intent)
- {"tier":2} — active suicidal/self-harm ideation, abuse disclosure, ED behaviors, psychosis-like signals
- {"tier":3} — imminent danger, stated plan, immediate harm to self or others

Be conservative: when in doubt between two tiers, pick the higher. Catch metaphor: "I just want it all to stop forever" → tier 2 even if no method.

Output JSON only. No commentary. No method names.`;

interface LlmTierResult {
  tier: CrisisTier;
}

async function llmTier(message: string): Promise<LlmTierResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const resp = await haiku().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 30,
      temperature: 0,
      system: LLM_SAFETY_PROMPT,
      messages: [{ role: "user", content: message.slice(0, 2000) }],
    });
    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    const match = text.match(/\{[^}]*"tier"\s*:\s*([0-3])[^}]*\}/);
    if (!match) return null;
    const tier = Number(match[1]) as CrisisTier;
    return { tier };
  } catch (err) {
    console.warn("[safety/llm] pass failed, falling back to regex", (err as Error).message);
    return null;
  }
}

function routeFor(tier: CrisisTier): { category: CrisisCategory; route: Route } {
  switch (tier) {
    case 3: return { category: "plan_or_imminent", route: "tier3_script" };
    case 2: return { category: "active_ideation", route: "tier2_script" };
    case 1: return { category: "passive_ideation", route: "tier1_script" };
    default: return { category: "none", route: "normal" };
  }
}

/**
 * Layered classifier: regex first (cheap, deterministic), then LLM second
 * pass when enabled. Returns whichever tier is higher — we never lower a
 * tier that the regex caught.
 */
export async function classifySafetyWithLLM(message: string): Promise<SafetyResult> {
  const regex = classifySafety(message);
  if (regex.tier > 0) return regex; // regex already escalated; trust it.
  if (process.env.CRISIS_LLM_PASS !== "on") return regex;
  const llm = await llmTier(message);
  if (!llm || llm.tier === 0) return regex;
  const { category, route } = routeFor(llm.tier);
  return {
    tier: llm.tier,
    category,
    confidence: 0.7,
    triggerPhrases: ["(llm-detected)"],
    metaphorFlagged: true,
    route,
  };
}
