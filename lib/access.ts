/**
 * What a member can use, decided on the server from their record.
 *
 * Business rules (see the roadmap):
 * - Chat with Aura is free for everyone, always.
 * - The first FOUNDING_MEMBER_CAP members get voice and circles free for
 *   FOUNDING_MONTHS from their own sign-up date, with a fair-use voice cap.
 * - After that, voice and circles come with a paid plan (Stripe, later).
 *
 * Nothing on the client decides access. Routes call accessFor() with the
 * user's database record.
 */

export const FOUNDING_MEMBER_CAP = Number(process.env.FOUNDING_MEMBER_CAP ?? 150);
export const FOUNDING_MONTHS = Number(process.env.FOUNDING_MONTHS ?? 4);
export const FOUNDING_VOICE_MINUTES_PER_MONTH = Number(process.env.FOUNDING_VOICE_MINUTES ?? 60);
export const PRO_VOICE_MINUTES_PER_MONTH = 80;

export type AccessTier = "founding" | "pro" | "member";

export interface Access {
  tier: AccessTier;
  chat: true;
  voice: boolean;
  circles: boolean;
  voiceMinutesPerMonth: number;
  /** ISO date when founding access ends; only for founding members. */
  foundingUntil?: string;
  memberNumber?: number;
  /** True when this member is inside the founding cap, even if expired. */
  isFoundingMember: boolean;
}

export interface AccessInput {
  memberNumber?: number | null;
  createdAt: string | Date;
  plan: "free" | "pro";
  isAdmin?: boolean;
}

function addMonths(d: Date, months: number): Date {
  const out = new Date(d);
  out.setUTCMonth(out.getUTCMonth() + months);
  return out;
}

export function accessFor(user: AccessInput, now: Date = new Date()): Access {
  const memberNumber = user.memberNumber ?? undefined;
  const isFoundingMember = memberNumber != null && memberNumber <= FOUNDING_MEMBER_CAP;
  const foundingUntil = isFoundingMember ? addMonths(new Date(user.createdAt), FOUNDING_MONTHS) : undefined;
  const foundingActive = !!foundingUntil && now < foundingUntil;

  if (user.isAdmin || foundingActive) {
    return {
      tier: "founding",
      chat: true,
      voice: true,
      circles: true,
      voiceMinutesPerMonth: FOUNDING_VOICE_MINUTES_PER_MONTH,
      foundingUntil: foundingUntil?.toISOString(),
      memberNumber,
      isFoundingMember,
    };
  }
  if (user.plan === "pro") {
    return {
      tier: "pro",
      chat: true,
      voice: true,
      circles: true,
      voiceMinutesPerMonth: PRO_VOICE_MINUTES_PER_MONTH,
      foundingUntil: foundingUntil?.toISOString(),
      memberNumber,
      isFoundingMember,
    };
  }
  return {
    tier: "member",
    chat: true,
    voice: false,
    circles: false,
    voiceMinutesPerMonth: 0,
    foundingUntil: foundingUntil?.toISOString(),
    memberNumber,
    isFoundingMember,
  };
}

/** Short human line for the dashboard. */
export function describeAccess(a: Access): string {
  if (a.tier === "founding" && a.foundingUntil) {
    const d = new Date(a.foundingUntil);
    const when = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    return `Founding member${a.memberNumber ? ` #${a.memberNumber}` : ""}. Everything is open until ${when}.`;
  }
  if (a.tier === "pro") return "Your space is open. Voice and circles included.";
  return "Chat with Aura is free, always. Voice and circles are part of an open space.";
}
