import { sendEmail } from "./email";
import { getTemplate, EmailKey, TemplateCtx } from "./email-templates";
import { dbEnabled, prisma } from "./prisma";

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
const memoryQueue: QueuedEmail[] = globalAny.__calmEmailQueue ?? [];
globalAny.__calmEmailQueue = memoryQueue;

export async function scheduleEmail(args: {
  userId: string;
  to: string;
  templateKey: EmailKey;
  ctx: TemplateCtx;
  delayMinutesOverride?: number;
  replaceExisting?: boolean;
}): Promise<QueuedEmail> {
  const tpl = getTemplate(args.templateKey);
  const delay = args.delayMinutesOverride ?? tpl.delayMinutes;
  const scheduledAt = new Date(Date.now() + delay * 60 * 1000);

  if (dbEnabled) {
    if (args.replaceExisting) {
      await prisma.emailQueueRow.updateMany({
        where: {
          userId: args.userId,
          templateKey: args.templateKey,
          status: "pending",
        },
        data: { status: "cancelled" },
      });
    }
    const row = await prisma.emailQueueRow.create({
      data: {
        userId: args.userId,
        to: args.to,
        templateKey: args.templateKey,
        ctxJson: args.ctx as unknown as object,
        scheduledAt,
        status: "pending",
      },
    });
    return rowToRecord(row);
  }

  if (args.replaceExisting) {
    for (const item of memoryQueue) {
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
    scheduledAt: scheduledAt.toISOString(),
    status: "pending",
    ctx: args.ctx,
  };
  memoryQueue.push(record);
  return record;
}

export async function cancelPendingFor(userId: string, templateKey?: EmailKey): Promise<void> {
  if (dbEnabled) {
    await prisma.emailQueueRow.updateMany({
      where: {
        userId,
        ...(templateKey ? { templateKey } : {}),
        status: "pending",
      },
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
}

export async function processDueEmails(): Promise<ProcessResult> {
  const result: ProcessResult = { attempted: 0, sent: 0, failed: 0 };
  const now = new Date();

  if (dbEnabled) {
    const due = await prisma.emailQueueRow.findMany({
      where: { status: "pending", scheduledAt: { lte: now } },
      orderBy: { scheduledAt: "asc" },
      take: 200,
    });
    for (const item of due) {
      result.attempted += 1;
      try {
        const tpl = getTemplate(item.templateKey as EmailKey);
        const built = tpl.build(item.ctxJson as unknown as TemplateCtx);
        const sent = await sendEmail({
          to: item.to,
          subject: built.subject,
          html: built.html,
          text: built.text,
        });
        if (sent.ok) {
          await prisma.emailQueueRow.update({
            where: { id: item.id },
            data: { status: "sent", sentAt: new Date() },
          });
          result.sent += 1;
        } else {
          await prisma.emailQueueRow.update({
            where: { id: item.id },
            data: { status: "failed", error: sent.error ?? "unknown" },
          });
          result.failed += 1;
        }
      } catch (err) {
        await prisma.emailQueueRow.update({
          where: { id: item.id },
          data: { status: "failed", error: (err as Error).message },
        });
        result.failed += 1;
      }
    }
    return result;
  }

  for (const item of memoryQueue) {
    if (item.status !== "pending") continue;
    if (Date.parse(item.scheduledAt) > now.getTime()) continue;
    result.attempted += 1;
    try {
      const tpl = getTemplate(item.templateKey);
      const built = tpl.build(item.ctx);
      const sent = await sendEmail({ to: item.to, subject: built.subject, html: built.html, text: built.text });
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

export async function listQueue(): Promise<QueuedEmail[]> {
  if (dbEnabled) {
    const rows = await prisma.emailQueueRow.findMany({
      orderBy: { scheduledAt: "desc" },
      take: 200,
    });
    return rows.map(rowToRecord);
  }
  return [...memoryQueue].sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1));
}

export async function summariseQueue() {
  if (dbEnabled) {
    const [pending, sent, failed, cancelled] = await Promise.all([
      prisma.emailQueueRow.count({ where: { status: "pending" } }),
      prisma.emailQueueRow.count({ where: { status: "sent" } }),
      prisma.emailQueueRow.count({ where: { status: "failed" } }),
      prisma.emailQueueRow.count({ where: { status: "cancelled" } }),
    ]);
    return { pending, sent, failed, cancelled };
  }
  const summary = { pending: 0, sent: 0, failed: 0, cancelled: 0 };
  for (const item of memoryQueue) summary[item.status] += 1;
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
  };
}
