import { recentFeedback } from "@/lib/admin-stats";
import { FeedbackList } from "@/components/admin/FeedbackList";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const items = await recentFeedback();
  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Feedback</h2>
      <p style={{ color: "var(--calm-ink-70)", marginBottom: 32 }}>
        Low-star feedback shows up here first, because that is the feedback worth acting on.
        Nothing reaches the public site on its own: a consented review sits in
        &ldquo;Waiting to publish&rdquo; until someone reads it and says yes.
      </p>
      <FeedbackList items={items} />
    </div>
  );
}
