export type FeedbackStatus = "new" | "reviewed" | "responded";
export type FeedbackCategory = "positive" | "neutral" | "needs-attention";

export interface FeedbackRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  publicConsent: boolean;
  category: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: string;
  adminResponse?: string;
  respondedAt?: string;
}

const globalAny = globalThis as unknown as { __calmFeedback?: FeedbackRecord[] };
const store: FeedbackRecord[] = globalAny.__calmFeedback ?? [];
globalAny.__calmFeedback = store;

function categorize(rating: number): FeedbackCategory {
  if (rating >= 4) return "positive";
  if (rating < 3) return "needs-attention";
  return "neutral";
}

export function captureFeedback(input: {
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  publicConsent: boolean;
}): FeedbackRecord {
  const record: FeedbackRecord = {
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    comment: input.comment.trim(),
    publicConsent: input.publicConsent,
    category: categorize(input.rating),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  store.push(record);
  return record;
}

export function listFeedback(filter?: { category?: FeedbackCategory; status?: FeedbackStatus }): FeedbackRecord[] {
  return [...store]
    .filter((r) => !filter?.category || r.category === filter.category)
    .filter((r) => !filter?.status || r.status === filter.status)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function publicHighlights(limit = 6): FeedbackRecord[] {
  return store
    .filter((r) => r.category === "positive" && r.publicConsent && r.comment.length > 0)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);
}

export function setFeedbackStatus(
  id: string,
  status: FeedbackStatus,
  adminResponse?: string
): FeedbackRecord | null {
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const cur = store[idx];
  const next: FeedbackRecord = {
    ...cur,
    status,
    adminResponse: adminResponse ?? cur.adminResponse,
    respondedAt: status === "responded" ? new Date().toISOString() : cur.respondedAt,
  };
  store[idx] = next;
  return next;
}

export function feedbackStats() {
  const total = store.length;
  const positive = store.filter((r) => r.category === "positive").length;
  const needs = store.filter((r) => r.category === "needs-attention").length;
  const avg = total === 0 ? 0 : store.reduce((s, r) => s + r.rating, 0) / total;
  return { total, positive, needsAttention: needs, average: Number(avg.toFixed(2)) };
}
