import { sendEmail } from "./email";
import { getTemplate, EmailKey, TemplateCtx } from "./email-templates";

/**
 * Lightweight email queue. MVP storage is in-memory; behind a single
 * `processDue()` call so a Vercel Cron / external scheduler can drive it.
 *
 * In production, swap this for a real job queue (BullMQ + Redis, or your
 * mail provider's scheduling features).
 */

export type EmailStatus = "pending" | "sent" | "failed" | "cancelled";

export interface QueuedEmail {
  id: string;
  userId: string;
  to: string;
  templateKey: EmailKey;
  scheduledAt: string;
  status: EmailStatus;
  ctx: TemplateCtx;
  sentAt?: string;
  error?: string;
}

const globalAny = globalThis as unknown as { __calmEmailQueue?: QueuedEmail[] };
const queue: QueuedEmail[] = globalAny.__calmEmailQueue ?? [];
globalAny.__calmEmailQueue = queue;

export function scheduleEmail(args: {
  userId: string;
  to: string;
  templateKey: EmailKey;
  ctx: TemplateCtx;
  /** Override the template's default delay in minutes. */
  delayMinutesOverride?: number;
  /** Replace any existing pending email of the same templateKey for this user. */
  replaceExisting?: boolean;
}): QueuedEmail {
  const tpl = getTemplate(args.templateKey);
  const delay = args.delayMinutesOverride ?? tpl.delayMinutes;
  const scheduledAt = new Date(Date.now() + delay * 60 * 1000).toISOString();

  if (args.replaceExisting) {
    for (const item of queue) {
      if (
        item.userId === args.userId &&
        item.templateKey === args.templateKey &&
        item.status === "pending"
      ) {
        item.status = "cancelled";
      }
    }
  }

  const record: QueuedEmail = {
    id: `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: args.userId,
    to: args.to,
    templateKey: args.templateKey,
    scheduledAt,
    status: "pending",
    ctx: args.ctx,
  };
  queue.push(record);
  return record;
}

export function cancelPendingFor(userId: string, templateKey?: EmailKey) {
  for (const item of queue) {
    if (item.userId !== userId) continue;
    if (templateKey && item.templateKey !== templateKey) continue;
    if (item.status === "pending") item.status = "cancelled";
  }
}

export interface ProcessResult {
  attempted: number;
  sent: number;
  failed: number;
}

export async function processDueEmails(): Promise<ProcessResult> {
  const now = Date.now();
  const result: ProcessResult = { attempted: 0, sent: 0, failed: 0 };

  for (const item of queue) {
    if (item.status !== "pending") continue;
    if (Date.parse(item.scheduledAt) > now) continue;

    result.attempted += 1;
    try {
      const tpl = getTemplate(item.templateKey);
      const built = tpl.build(item.ctx);
      const sent = await sendEmail({
        to: item.to,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
      if (sent.ok) {
        item.status = "sent";
        item.sentAt = new Date().toISOString();
        result.sent += 1;
      } else {
        item.status = "failed";
        item.error = sent.error;
        result.failed += 1;
      }
    } catch (err) {
      item.status = "failed";
      item.error = (err as Error).message;
      result.failed += 1;
    }
  }

  return result;
}

export function listQueue(): QueuedEmail[] {
  return [...queue].sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1));
}

export function summariseQueue() {
  const summary = { pending: 0, sent: 0, failed: 0, cancelled: 0 };
  for (const item of queue) summary[item.status] += 1;
  return summary;
}
