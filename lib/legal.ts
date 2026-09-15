import { BRAND } from "./brand";

/**
 * What this product is allowed to say it is.
 *
 * Several US states now regulate AI mental health tools directly, and the
 * rules differ in kind rather than degree:
 *
 * - Illinois (Wellness and Oversight for Psychological Resources Act, in
 *   force since August 2025) prohibits providing, offering OR ADVERTISING
 *   therapy or psychotherapy services through AI without a licensed
 *   professional in charge. Marketing an app as an "AI therapist" is itself
 *   named as unlawful, with penalties up to $10,000 per violation. General
 *   wellness apps are exempt.
 * - Nevada (AB 406, July 2025) bars AI from standing in for a counsellor or
 *   psychologist.
 * - Utah (HB 452) permits it with disclosure: a mental health chatbot must
 *   state plainly that it is software at first contact, again when someone
 *   returns after a break, and any time they ask.
 * - California and New York require crisis detection, enforceable by private
 *   suit.
 *
 * The product is built to the strictest of these, because the alternative is
 * maintaining several versions of the truth. Aura is a wellness companion,
 * not a therapist; she does not diagnose, treat, or plan care; she discloses
 * that she is software without being asked; and every conversation runs
 * through a crisis layer.
 *
 * NOTE FOR WHOEVER OWNS THE MARKETING: the public site's head keywords are
 * "free AI therapist" and "AI therapist", which is the exact phrasing
 * Illinois names as unlawful advertising. That is a business and legal
 * decision rather than a code one, and it is flagged here so nobody has to
 * discover it in a letter.
 */

/** How long away counts as "returning", for the repeat disclosure. */
export const DISCLOSURE_REPEAT_DAYS = 7;

/** Shown in the conversation itself, where someone is actually talking. */
export const AI_DISCLOSURE_SHORT = "Aura is AI, not a human therapist.";

export const AI_DISCLOSURE_FULL = `Aura is software. She is not a therapist, not a licensed professional, and not a person. ${BRAND.name} does not diagnose conditions, provide treatment, or replace care from a qualified clinician. If you are in danger right now, contact your local emergency number.`;

/** Things this product must never be described as, in copy or in schema. */
export const FORBIDDEN_CLAIMS = [
  "therapy session",
  "your therapist",
  "clinically proven",
  "treats depression",
  "treats anxiety",
  "diagnoses",
  "prescribes",
  "medical advice",
] as const;

/**
 * True when someone should be told again that they are talking to software:
 * on their first conversation, or after a gap. Utah's rule, applied to
 * everyone because a member in Manchester deserves the same clarity as a
 * member in Salt Lake City.
 */
export function needsDisclosure(lastSeenAt: string | Date | null | undefined, now: Date = new Date()): boolean {
  if (!lastSeenAt) return true;
  const last = new Date(lastSeenAt).getTime();
  if (!Number.isFinite(last)) return true;
  return now.getTime() - last > DISCLOSURE_REPEAT_DAYS * 24 * 60 * 60 * 1000;
}
