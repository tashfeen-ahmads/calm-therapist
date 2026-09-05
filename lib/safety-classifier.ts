/**
 * Layered safety classifier.
 *
 * 1. Regex first: cheap, deterministic, multilingual, with guards against
 *    the common false positives (third person, negation, past tense, idiom).
 * 2. A small model pass second, on by default, with a short timeout. It can
 *    only raise a tier, never lower one.
 *
 * The regexes below need a small number of means-related words in order to
 * detect them. They are kept minimal and non-graphic, and nothing in this
 * file is ever shown to a user. Crisis scripts never name methods.
 */

import OpenAI from "openai";

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

/* ------------------------------------------------------------------ */
/* Vocabulary                                                          */
/* ------------------------------------------------------------------ */

// Intent phrases (English), matched as a group so tense and spacing vary.
const KILL_SELF = String.raw`(kill(ing)?\s+myself|end(ing)?\s+(it\s+all|my\s+life|everything|things|it)|take\s+my\s+(own\s+)?life|(un)?alive\s+myself|unalive|kms|off\s+myself|not\s+(be\s+)?(here|around)\s+(anymore|any\s+more)|(wanna|want\s+to|going\s+to|gonna)\s+die|(don'?t|do\s+not)\s+want\s+to\s+(live|be\s+alive|wake\s+up|exist)|no\s+(point|reason)\s+(in\s+|to\s+)?(liv(e|ing)|go(ing)?\s+on)|better\s+off\s+dead|(rather|wish\s+i\s+(was|were))\s+dead|wish\s+i\s+(was|were)\s+gone)`;
const TIME_NOW = String.raw`(tonight|right\s+now|today|this\s+(evening|morning|afternoon|week(end)?)|before\s+(morning|tomorrow)|in\s+an?\s+(hour|few\s+hours))`;
// Minimal means vocabulary. Needed for detection; never shown or echoed.
const MEANS = String.raw`(gun|pills?|overdos(e|ed|ing)|rope|blade|razor|jump(ing)?\s+(off|from)|bridge|train|traffic)`;

// Multilingual intent, Roman and native scripts. Urdu/Hindi, Arabic, Spanish, French.
const INTENT_MULTI = [
  // Urdu / Hindi (Roman)
  /\b(marna|mar\s*jana|mar\s*jaun|jeena\s+nahi|jina\s+nahi|khud\s*kushi|khudkushi|zindagi\s+khatam|apni\s+jaan)\b/i,
  // Hindi / Urdu (native scripts)
  /(मरना\s+चाहत|मर\s+जाना|जीना\s+नहीं|आत्महत्या|खुदकुशी|مرنا\s+چاہت|خودکشی|جینا\s+نہیں|زندگی\s+ختم)/,
  // Arabic
  /(انتحار|أنتحر|انتحر|أريد\s+أن\s+أموت|بدي\s+موت|ابي\s+اموت|ما\s+بدي\s+عيش|أموت)/,
  // Spanish
  /\b(quiero\s+morir(me)?|no\s+quiero\s+vivir|suicidarme|matarme|quitarme\s+la\s+vida|acabar\s+con\s+todo)\b/i,
  // French
  /\b(je\s+veux\s+mourir|me\s+suicider|en\s+finir|plus\s+envie\s+de\s+vivre)\b/i,
];

const TIER3 = [
  new RegExp(String.raw`\b${TIME_NOW}\b[^.!?\n]{0,60}\b${KILL_SELF}\b`, "i"),
  new RegExp(String.raw`\b${KILL_SELF}\b[^.!?\n]{0,60}\b${TIME_NOW}\b`, "i"),
  new RegExp(String.raw`\b(i\s+)?(have|got|holding|bought|found|with)\s+(a\s+|the\s+|my\s+)?${MEANS}\b[^.!?\n]{0,80}\b(myself|my\s+life|end|die|use\s+it)\b`, "i"),
  new RegExp(String.raw`\b(i\s+)?(overdosed|took\s+(too\s+many|a\s+lot\s+of|all\s+the)\s+pills|swallowed\s+(the|all))\b`, "i"),
  new RegExp(String.raw`\b(jump(ing)?\s+(off|from)\s+(the|a|my))\b`, "i"),
  /\b(have|got|made|wrote|written)\s+(a\s+)?(plan|note|letter)\b[^.!?\n]{0,60}\b(end|kill|die|myself|goodbye)\b/i,
  /\b(going\s+to|gonna|about\s+to|ready\s+to)\s+(end\s+(it|my\s+life)|kill\s+myself|do\s+it\s+tonight)\b/i,
];

const TIER2 = [
  new RegExp(String.raw`\b${KILL_SELF}\b`, "i"),
  /\b(suicidal|suicide)\b/i,
  /\bi\s*(can'?t|cannot)\s+(do|take|handle)\s+(this|it|life)\s+(anymore|any\s+more)\b/i,
  /\bwant\s+to\s+(disappear|vanish)\s+(forever|for\s+good|completely)\b/i,
  /\b(everyone|they'?d|people)\s+(would\s+be|are)\s+better\s+off\s+without\s+me\b/i,
  ...INTENT_MULTI,
];

const TIER1 = [
  /\b(everyone\s+would\s+be\s+better\s+off|wish\s+i\s+(could|would)\s+(just\s+)?(sleep\s+forever|disappear))\b/i,
  /\b(don'?t\s+want\s+to\s+wake\s+up|just\s+want\s+(it|everything)\s+to\s+stop|tired\s+of\s+(being\s+alive|living|existing))\b/i,
  /\b(what'?s\s+the\s+point\s+(of\s+(any\s+of\s+)?(this|it|living|going\s+on))?)\b/i,
  /\b(hopeless|nothing\s+matters\s+anymore|no\s+way\s+out)\b/i,
];

const HARM_OTHERS = [
  /\b(want\s+to|going\s+to|gonna|could|might)\s+(hurt|kill|strangle|stab|shoot)\s+(him|her|them|my\s+(partner|husband|wife|kid|child|children|baby|mother|father|mom|dad|boss))\b/i,
  /\b(thoughts\s+of|thinking\s+about)\s+(hurting|killing)\s+(him|her|them|my\s+\w+|someone|people)\b/i,
];

const ABUSE = [
  /\b(he|she|they|my\s+(husband|wife|partner|boyfriend|girlfriend|dad|father|mom|mother|brother|son|uncle|ex))\s+(hits?|hit|beats?|beat|slaps?|slapped|chokes?|choked|strangles?|kicks?|kicked|threatens?|threatened|hurts?|hurt|forces?|forced|pushes?|pushed)\s+me\b/i,
  /\bi'?m\s+(scared|afraid|terrified)\s+of\s+(him|her|them|my\s+(husband|wife|partner|dad|father|family))\b/i,
  /\b(controls?|checks?|takes?)\s+(my|the)\s+(money|phone|passport|food|access|car\s+keys)\b/i,
  /\b(won'?t|doesn'?t|does\s+not)\s+let\s+me\s+(leave|go\s+out|see\s+(my\s+)?(friends|family)|work|have\s+money)\b/i,
];

const PSYCHOSIS = [
  /\b(voices?\s+(are\s+)?(telling|told|saying|say)\s+me|i\s+(hear|keep\s+hearing)\s+voices)\b/i,
  /\b(they'?re|they\s+are|someone\s+is|the\s+government\s+is)\s+(watching|following|tracking|recording)\s+me\b/i,
  /\b(implanted|chip\s+in\s+my|reading\s+my\s+(mind|thoughts))\b/i,
];

const ED = [
  /\b(haven'?t|have\s+not|didn'?t)\s+eaten\s+(in|for)\s+(\d+|two|three|four|five|several)\s+days\b/i,
  /\b(haven'?t|have\s+not)\s+eaten\s+(all\s+week|since\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|last\s+week))\b/i,
  /\b(throwing\s+up|threw\s+up|purg(e|ed|ing)|make\s+myself\s+(sick|throw\s+up))\s+(after|when|so|to)\b/i,
  /\b(restrict(ing|ed)?\s+(to|myself\s+to)\s+\d+|laxatives\s+to|chewing\s+and\s+spitting)\b/i,
];

const SELF_HARM_NSSI = [
  /\b(cut(ting)?|burn(ing|ed|t)?|scratch(ing|ed)?|hit(ting)?)\s+(myself|my\s+(arms?|legs?|thighs?|wrists?))\b/i,
  /\bself.?harm(ed|ing)?\b/i,
  /\b(hurt|hurting)\s+myself\s+(again|on\s+purpose|last\s+night|tonight)\b/i,
];

/* ------------------------------------------------------------------ */
/* Guards against the common false positives                          */
/* ------------------------------------------------------------------ */

const THIRD_PERSON = /\b(my\s+(friend|sister|brother|mom|mother|dad|father|son|daughter|cousin|colleague|coworker|partner|husband|wife|patient|client|student)|someone\s+i\s+know|a\s+friend|he\s+is|she\s+is|they\s+are)\b[^.!?\n]{0,40}\b(suicidal|suicide|self.?harm|wants?\s+to\s+die|kill\s+(him|her|them)self)/i;
const NEGATED = /\b(i'?m\s+not|i\s+am\s+not|not\s+(feeling\s+)?suicidal|never\s+(been\s+)?suicidal|no\s+thoughts\s+of|don'?t\s+(feel|have\s+thoughts\s+of)\s+(suicid|kill|hurt))/i;
const PAST_RECOVERED = /\b(used\s+to\s+(be|feel)|was\s+suicidal\s+(in|back|years?|when)|years?\s+ago|in\s+20\d\d|back\s+then|not\s+anymore|i'?m\s+(ok|okay|fine|better)\s+now)\b/i;
const IDIOMS = [
  /\b(end\s+(it|things)\s+with\s+(him|her|them|my|the|this))\b/i, // breakup
  // A task or arrangement being ended, not a life.
  /\b(deadline|project|assignment|exam|essay|shift|contract|lease|subscription|meeting|call|semester|course)\b[^.!?\n]{0,60}\b(end|ending|finish)\s+(it|things|this)\b/i,
  /\b(end|ending|finish)\s+(it|things|this)\b[^.!?\n]{0,40}\b(deadline|project|assignment|exam|essay|shift|contract|lease|subscription|meeting|call|semester|course)\b/i,
  /\bkill(ing)?\s+(it|time|me\s+(with|how)|the\s+(vibe|mood|lights))\b/i,
  /\b(dying|dead)\s+(to|from)\s+(see|know|laugh|laughing|tired|exhaust)/i,
  /\b(disappear|get\s+away)\s+(for|to)\s+(a|the)\s+(weekend|week|day|beach|holiday|vacation|trip)\b/i,
  /\b(deadline|dead\s+end|dead\s+tired|dead\s+phone|dead\s+battery)\b/i,
  /\b(cut(ting)?\s+myself\s+off|cut\s+myself\s+some\s+slack)\b/i,
  /\bhaven'?t\s+eaten\s+since\s+(breakfast|lunch|this\s+morning|dinner|yesterday)\b/i,
  /\b(shoot|shooting)\s+(a\s+)?(video|photo|message|email|hoops)/i,
  /\bjump(ing)?\s+(off|from)\s+(the\s+)?(call|meeting|couch|bed)\b/i,
];

function matchAny(re: RegExp[], s: string): string | null {
  for (const r of re) {
    const m = s.match(r);
    if (m) return m[0];
  }
  return null;
}

function result(tier: CrisisTier, category: CrisisCategory, route: Route, phrase: string | null, confidence: number): SafetyResult {
  return { tier, category, confidence, triggerPhrases: phrase ? [phrase] : [], metaphorFlagged: false, route };
}

export function classifySafety(message: string): SafetyResult {
  const raw = message ?? "";
  // Idioms are removed before matching so "end it with him" cannot trip "end it".
  let text = raw;
  for (const r of IDIOMS) text = text.replace(r, " ");

  const thirdPerson = THIRD_PERSON.test(text);
  const negated = NEGATED.test(text);
  const recovered = PAST_RECOVERED.test(text);

  const t3 = matchAny(TIER3, text);
  if (t3 && !thirdPerson) return result(3, "plan_or_imminent", "tier3_script", t3, 0.85);

  const harm = matchAny(HARM_OTHERS, text);
  if (harm) return result(3, "harm_to_others", "harm_others_script", harm, 0.8);

  const psychosis = matchAny(PSYCHOSIS, text);
  if (psychosis) return result(3, "psychosis_signs", "psychosis_script", psychosis, 0.7);

  const abuse = matchAny(ABUSE, text);
  if (abuse) return result(2, "abuse_disclosure", "abuse_script", abuse, 0.75);

  const t2 = matchAny(TIER2, text);
  if (t2) {
    // Someone else, a denial, or a recovered past: watch, do not escalate.
    if (thirdPerson || negated || recovered) return result(1, "passive_ideation", "tier1_script", t2, 0.5);
    return result(2, "active_ideation", "tier2_script", t2, 0.7);
  }

  const ed = matchAny(ED, text);
  if (ed) return result(2, "disordered_eating", "ed_script", ed, 0.65);

  const nssi = matchAny(SELF_HARM_NSSI, text);
  if (nssi && !thirdPerson) return result(2, "self_harm_non_suicidal", "tier2_script", nssi, 0.7);

  const t1 = matchAny(TIER1, text);
  if (t1) return result(1, "passive_ideation", "tier1_script", t1, 0.6);

  return result(0, "none", "normal", null, 1.0);
}

/* ------------------------------------------------------------------ */
/* Model second pass — on by default, short timeout, only raises.       */
/* ------------------------------------------------------------------ */

let _safety: OpenAI | null = null;
function safetyClient(): OpenAI {
  if (!_safety) _safety = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 3000, maxRetries: 0 });
  return _safety;
}

/** Small, fast model for the second pass. Same family as Aura unless overridden. */
export const SAFETY_MODEL = process.env.SAFETY_MODEL ?? "gpt-5.4-mini";

const LLM_SAFETY_PROMPT = `You are a safety classifier for a mental-wellness app. The message may be in any language, including Urdu, Hindi, Arabic, Spanish, or French, and may mix languages. Output JSON only.

Return one of:
- {"tier":0} ordinary content, venting, sadness, stress, idiom ("this deadline is killing me"), someone ELSE's crisis, or a clearly past and recovered episode
- {"tier":1} passive ideation, hopelessness, "what's the point", not wanting to wake up, low-level self-harm hints, no intent
- {"tier":2} active suicidal or self-harm ideation about themselves, disclosure of abuse happening to them, eating-disorder behaviours, hearing voices or paranoia
- {"tier":3} a plan, access to means, a time frame, an act already taken, or intent to harm someone else

When in doubt between two tiers, pick the higher. Metaphor counts: "I just want it all to stop forever" is tier 2. A single word like "kms" is tier 2.

Output JSON only. No commentary. No method names.`;

async function llmTier(message: string): Promise<CrisisTier | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const resp = await safetyClient().chat.completions.create({
      model: SAFETY_MODEL,
      // Reasoning tokens count against this budget, so leave headroom for a tiny JSON answer.
      max_completion_tokens: 200,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: LLM_SAFETY_PROMPT },
        { role: "user", content: message.slice(0, 2000) },
      ],
    });
    const text = (resp.choices[0]?.message?.content ?? "").trim();
    const match = text.match(/"tier"\s*:\s*([0-3])/);
    return match ? (Number(match[1]) as CrisisTier) : null;
  } catch (err) {
    console.warn("[safety/llm] pass failed, regex only:", (err as Error).message);
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

export function llmPassEnabled(): boolean {
  return process.env.CRISIS_LLM_PASS !== "off";
}

/**
 * Regex first, then the model pass when the regex found tier 1 or below.
 * The model can only raise the tier.
 */
export async function classifySafetyWithLLM(message: string): Promise<SafetyResult> {
  const regex = classifySafety(message);
  if (regex.tier >= 2) return regex;
  if (!llmPassEnabled()) return regex;
  const llm = await llmTier(message);
  if (llm == null || llm <= regex.tier) return regex;
  const { category, route } = routeFor(llm);
  return { tier: llm, category, confidence: 0.7, triggerPhrases: ["(model-detected)"], metaphorFlagged: true, route };
}
