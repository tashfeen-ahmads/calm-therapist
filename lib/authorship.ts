import { BRAND } from "./brand";

/**
 * Who stands behind the words on this site.
 *
 * Mental health is a YMYL ("Your Money or Your Life") topic. Google holds it
 * to a much higher bar than ordinary content: it wants a named author, stated
 * expertise, citations to primary research, a published editorial process, and
 * — for clinical claims — review by someone qualified.
 *
 * The honest position, stated once here and reflected everywhere:
 *
 * This content is NOT written or reviewed by a licensed clinician. We do not
 * claim that it is. Inventing a reviewer would be the single most damaging
 * thing we could do, both to a reader making a decision about their own care
 * and to the site the moment anyone checked.
 *
 * What we do claim is narrower and true: we read the primary literature, we
 * cite it, we say plainly where the evidence is thin, and we never present
 * this product as treatment. Where a page touches a clinical question, it
 * points at the research and at real care rather than answering it itself.
 *
 * When a clinician does review this content, add them as REVIEWER and the
 * schema picks it up automatically. Until then REVIEWER stays null.
 */

export interface Expert {
  name: string;
  /** What actually qualifies them. Plain, checkable, no inflation. */
  credential: string;
  /** A real URL that substantiates the person, when one exists. */
  url?: string;
}

/** The editorial team. Named, because "Organization" is a weak YMYL signal. */
export const AUTHOR: Expert = {
  name: `The ${BRAND.name} editorial team`,
  credential:
    "Writes from the published research on digital mental health, cites primary sources, and makes no clinical claims.",
};

/**
 * A licensed clinician who has reviewed the clinical content.
 * Null until that is genuinely true. Never fill this in speculatively.
 */
export const REVIEWER: Expert | null = null;

/** Where our editorial process is documented. Linked from every long page. */
export const EDITORIAL_POLICY_PATH = "/editorial-policy";

export interface Source {
  /** How the source is named in the page's reference list. */
  label: string;
  url: string;
  /** Publisher or journal, so a reader can weigh it without clicking. */
  publisher?: string;
  year?: number;
}
