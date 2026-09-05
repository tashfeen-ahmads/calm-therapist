import { BRAND } from "./brand";
import { sendEmail } from "./email";
import { getTemplate, EmailKey, TemplateCtx, isTransactional } from "./email-templates";
import { dbEnabled, prisma } from "./prisma";
import { ensureUnsubscribeToken, getUserById } from "./users";

/**
 * Email queue.
 *
 * - Rows are CLAIMED before sending (status "sending" + lockedAt), so two
 *   overlapping runs cannot both send the same row. Stale claims older than
 *   LOCK_MINUTES are released.
 * - Transient failures retry with exponential backoff up to MAX_ATTEMPTS.
 * - Marketing-class templates are skipped for members who opted out, and
 *   every one carries an unsubscribe link and headers. Transactional mail
 *   (verify, reset, receipts) is always sent.
 */

export type EmailStatus = "pending" | "sending" | "sent" | "failed" | "cancelled";

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
  attempts?: number;
  nextAttemptAt?: string;
  lockedAt?: string;
}

const BATCH = 40;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 10;

const globalAny = globalThis as unknown as { __calmEmailQueue?: QueuedEmail[] };
const memoryQueue: QueuedEmail[] = globalAny.__calmEmailQueue ?? [];
globalAny.__calmEmailQueue = memoryQueue;

const APP_URL = BRAND.url;

function backoffMinutes(attempt: number): number {
  return Math.min(6 * 60, 5 * 2 ** attempt); // 5, 10, 20, 40, 80 minutes, capped
}

export async function scheduleEmail(args: {
  userId: string;
  to: string;
  templateKey: EmailKey;
  ctx: TemplateCtx;
  delayMinutesOverride?: number;
  replaceExisting?: boolean;
  /** When true, nothing is scheduled if this key was ever queued for this member. */
  once?: boolean;
}): Promise<QueuedEmail | null> {
  const tpl = getTemplate(args.templateKey);
  const delay = args.delayMinutesOverride ?? tpl.delayMinutes;
  const scheduledAt = new Date(Date.now() + delay * 60 * 1000);

  if (args.once && (await hasEverScheduled(args.userId, args.templateKey))) return null;

  const ctx: TemplateCtx = { ...args.ctx, appUrl: args.ctx.appUrl || APP_URL };
  if (!isTransactional(args.templateKey)) {
    const token = await ensureUnsubscribeToken(args.userId);
    if (token) ctx.unsubscribeUrl = `${ctx.appUrl}/api/email/unsubscribe?t=${encodeURIComponent(token)}`;
  }

  if (dbEnabled) {
    if (args.replaceExisting) {
      await prisma.emailQueueRow.updateMany({
        where: { userId: args.userId, templateKey: args.templateKey, status: "pending" },
        data: { status: "cancelled" },
      });
    }
    const row = await prisma.emailQueueRow.create({
      data: {
        userId: args.userId,
        to: args.to,
        templateKey: args.templateKey,
        ctxJson: ctx as unknown as object,
        scheduledAt,
        status: "pending",
      },
    });
    return rowToRecord(row);
  }

  if (args.replaceExisting) {
    for (const item of memoryQueue) {
      if (item.userId === args.userId && item.templateKey === args.templateKey && item.status === "pending") {
        item.status = "cancelled";
      }
    }
  }
  const record: QueuedEmail = {
    id: `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: args.userId,
    to: args.to,
    templateKey: args.templateKey,
    scheduledAt: scheduledAt.toISOString(),
    status: "pending",
    ctx,
    attempts: 0,
  };
  memoryQueue.push(record);
  return record;
}

export async function hasEverScheduled(userId: string, templateKey: EmailKey): Promise<boolean> {
  if (dbEnabled) {
    const n = await prisma.emailQueueRow.count({ where: { userId, templateKey } });
    return n > 0;
  }
  return memoryQueue.some((i) => i.userId === userId && i.templateKey === templateKey);
}

export async function cancelPendingFor(userId: string, templateKey?: EmailKey): Promise<void> {
  if (dbEnabled) {
    await prisma.emailQueueRow.updateMany({
      where: { userId, ...(templateKey ? { templateKey } : {}), status: "pending" },
      data: { status: "cancelled" },
    });
    return;
  }
  for (const item of memoryQueue) {
    if (item.userId !== userId) continue;
    if (templateKey && item.templateKey !== templateKey) continue;
    if (item.status === "pending") item.status = "cancelled";
  }
}

export interface ProcessResult {
  attempted: number;
  sent: number;
  failed: number;
  retried: number;
  skipped: number;
}

async function deliver(item: QueuedEmail): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  // Opt-out applies to marketing-class mail only.
  if (!isTransactional(item.templateKey)) {
    const user = await getUserById(item.userId);
    if (!user || user.emailOptOut) return { ok: true, skipped: true };
  }
  const tpl = getTemplate(item.templateKey);
  const built = tpl.build(item.ctx);
  const headers: Record<string, string> = {};
  if (item.ctx.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${item.ctx.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  return sendEmail({ to: item.to, subject: built.subject, html: built.html, text: built.text, headers });
}

export async function processDueEmails(): Promise<ProcessResult> {
  const result: ProcessResult = { attempted: 0, sent: 0, failed: 0, retried: 0, skipped: 0 };
  const now = new Date();

  if (dbEnabled) {
    // Release stale claims from a run that died mid-send.
    await prisma.emailQueueRow.updateMany({
      where: { status: "sending", lockedAt: { lt: new Date(now.getTime() - LOCK_MINUTES * 60 * 1000) } },
      data: { status: "pending", lockedAt: null },
    });

    const candidates = await prisma.emailQueueRow.findMany({
      where: {
        status: "pending",
        scheduledAt: { lte: now },
        OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
      },
      orderBy: { scheduledAt: "asc" },
      take: BATCH,
      select: { id: true },
    });
    if (!candidates.length) return result;

    // Claim: only rows still pending at this instant flip to "sending".
    const ids = candidates.map((c) => c.id);
    await prisma.emailQueueRow.updateMany({
      where: { id: { in: ids }, status: "pending" },
      data: { status: "sending", lockedAt: now },
    });
    const claimed = await prisma.emailQueueRow.findMany({ where: { id: { in: ids }, status: "sending", lockedAt: now } });

    for (const row of claimed) {
      const item = rowToRecord(row);
      result.attempted += 1;
      try {
        const r = await deliver(item);
        if (r.skipped) {
          await prisma.emailQueueRow.update({ where: { id: item.id }, data: { status: "cancelled", lockedAt: null, error: "opted out" } });
          result.skipped += 1;
        } else if (r.ok) {
          await prisma.emailQueueRow.update({ where: { id: item.id }, data: { status: "sent", sentAt: new Date(), lockedAt: null } });
          result.sent += 1;
        } else {
          await scheduleRetryDb(row.id, row.attempts, r.error ?? "unknown", result);
        }
      } catch (err) {
        await scheduleRetryDb(row.id, row.attempts, (err as Error).message, result);
      }
    }
    return result;
  }

  for (const item of memoryQueue) {
    if (item.status !== "pending") continue;
    if (Date.parse(item.scheduledAt) > now.getTime()) continue;
    if (item.nextAttemptAt && Date.parse(item.nextAttemptAt) > now.getTime()) continue;
    item.status = "sending";
    result.attempted += 1;
    try {
      const r = await deliver(item);
      if (r.skipped) {
        item.status = "cancelled";
        item.error = "opted out";
        result.skipped += 1;
      } else if (r.ok) {
        item.status = "sent";
        item.sentAt = new Date().toISOString();
        result.sent += 1;
      } else {
        retryMemory(item, r.error ?? "unknown", result);
      }
    } catch (err) {
      retryMemory(item, (err as Error).message, result);
    }
  }
  return result;
}

async function scheduleRetryDb(id: string, attempts: number, error: string, result: ProcessResult) {
  const next = attempts + 1;
  if (next >= MAX_ATTEMPTS) {
    await prisma.emailQueueRow.update({ where: { id }, data: { status: "failed", error, attempts: next, lockedAt: null } });
    result.failed += 1;
    return;
  }
  await prisma.emailQueueRow.update({
    where: { id },
    data: {
      status: "pending",
      error,
      attempts: next,
      lockedAt: null,
      nextAttemptAt: new Date(Date.now() + backoffMinutes(next) * 60 * 1000),
    },
  });
  result.retried += 1;
}

function retryMemory(item: QueuedEmail, error: string, result: ProcessResult) {
  const next = (item.attempts ?? 0) + 1;
  item.attempts = next;
  item.error = error;
  if (next >= MAX_ATTEMPTS) {
    item.status = "failed";
    result.failed += 1;
    return;
  }
  item.status = "pending";
  item.nextAttemptAt = new Date(Date.now() + backoffMinutes(next) * 60 * 1000).toISOString();
  result.retried += 1;
}

export async function listQueue(): Promise<QueuedEmail[]> {
  if (dbEnabled) {
    const rows = await prisma.emailQueueRow.findMany({ orderBy: { scheduledAt: "desc" }, take: 200 });
    return rows.map(rowToRecord);
  }
  return [...memoryQueue].sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1));
}

export async function summariseQueue() {
  if (dbEnabled) {
    const [pending, sent, failed, cancelled] = await Promise.all([
      prisma.emailQueueRow.count({ where: { status: { in: ["pending", "sending"] } } }),
      prisma.emailQueueRow.count({ where: { status: "sent" } }),
      prisma.emailQueueRow.count({ where: { status: "failed" } }),
      prisma.emailQueueRow.count({ where: { status: "cancelled" } }),
    ]);
    return { pending, sent, failed, cancelled };
  }
  const summary = { pending: 0, sent: 0, failed: 0, cancelled: 0 };
  for (const item of memoryQueue) {
    const k = item.status === "sending" ? "pending" : item.status;
    summary[k] += 1;
  }
  return summary;
}

interface PrismaEmailRow {
  id: string;
  userId: string;
  to: string;
  templateKey: string;
  ctxJson: unknown;
  scheduledAt: Date;
  status: string;
  sentAt: Date | null;
  error: string | null;
  attempts: number;
  nextAttemptAt: Date | null;
  lockedAt: Date | null;
}

function rowToRecord(row: PrismaEmailRow): QueuedEmail {
  return {
    id: row.id,
    userId: row.userId,
    to: row.to,
    templateKey: row.templateKey as EmailKey,
    ctx: row.ctxJson as unknown as TemplateCtx,
    scheduledAt: row.scheduledAt.toISOString(),
    status: (row.status as EmailStatus) ?? "pending",
    sentAt: row.sentAt?.toISOString(),
    error: row.error ?? undefined,
    attempts: row.attempts,
    nextAttemptAt: row.nextAttemptAt?.toISOString(),
    lockedAt: row.lockedAt?.toISOString(),
  };
}
