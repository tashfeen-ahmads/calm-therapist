"use client";

import type { FeedbackRecord } from "@/lib/feedback";
import { useState } from "react";

interface Props {
  items: FeedbackRecord[];
}

const TABS: { key: "to-publish" | "needs-attention" | "neutral" | "positive" | "all"; label: string }[] = [
  { key: "to-publish", label: "Waiting to publish" },
  { key: "needs-attention", label: "Needs attention" },
  { key: "neutral", label: "Neutral" },
  { key: "positive", label: "Positive" },
  { key: "all", label: "All" },
];

export function FeedbackList({ items }: Props) {
  const [tab, setTab] = useState<typeof TABS[number]["key"]>("needs-attention");
  const [list, setList] = useState(items);
  const filtered =
    tab === "all"
      ? list
      : tab === "to-publish"
      ? // Consented, has words, and nobody has decided about it yet.
        list.filter((r) => r.publicConsent && r.comment.length > 0 && !r.published && !r.rejectedAt)
      : list.filter((r) => r.category === tab);

  const respond = async (id: string) => {
    const text = window.prompt("Your response (kept private to the team)");
    if (!text) return;
    const res = await fetch("/api/admin/feedback/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, response: text, status: "responded" }),
    });
    const data = await res.json();
    if (res.ok) {
      setList((prev) => prev.map((r) => (r.id === id ? data.record : r)));
    } else {
      window.alert(data.error ?? "Could not save response.");
    }
  };

  /**
   * Approve or decline a review for the public site. Declining keeps the row:
   * the feedback is still worth reading and the member may still deserve a
   * reply, it simply does not go on a marketing page.
   */
  const setPublished = async (id: string, published: boolean) => {
    const res = await fetch("/api/admin/feedback/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published }),
    });
    const data = await res.json();
    if (res.ok) setList((prev) => prev.map((r) => (r.id === id ? data.record : r)));
    else window.alert(data.error ?? "Could not change that.");
  };

  const markReviewed = async (id: string) => {
    const res = await fetch("/api/admin/feedback/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "reviewed" }),
    });
    const data = await res.json();
    if (res.ok) setList((prev) => prev.map((r) => (r.id === id ? data.record : r)));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`pill ${tab === t.key ? "active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "var(--calm-ink-40)", fontSize: 14 }}>Nothing here yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((r) => (
          <div
            key={r.id}
            style={{
              background: "var(--calm-white)",
              border: "1px solid var(--calm-ink-10)",
              borderLeft: `3px solid ${r.category === "needs-attention" ? "var(--calm-ink)" : r.category === "positive" ? "var(--calm-forest)" : "var(--calm-ink-40)"}`,
              borderRadius: 12,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{r.userName}</p>
                <p style={{ fontSize: 12, color: "var(--calm-ink-40)" }}>{r.userEmail}</p>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "var(--calm-ink-40)" }}>
                <span style={{ color: "var(--calm-forest)", fontSize: 16 }}>{"★".repeat(r.rating)}</span>
                <span style={{ color: "var(--calm-ink-10)", fontSize: 16 }}>{"★".repeat(5 - r.rating)}</span>
                <p>{new Date(r.createdAt).toLocaleString()}</p>
                <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {r.status}
                </p>
                {r.publicConsent && (
                  <p
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: r.published ? "var(--calm-forest)" : "var(--calm-ink-40)",
                    }}
                  >
                    {r.published ? "live on site" : r.rejectedAt ? "not published" : "consented, unreviewed"}
                  </p>
                )}
              </div>
            </div>
            {r.comment && (
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--calm-ink)" }}>{r.comment}</p>
            )}
            {r.adminResponse && (
              <p style={{ fontSize: 14, color: "var(--calm-ink-70)", borderLeft: "2px solid var(--calm-forest)", paddingLeft: 12 }}>
                <strong>Response:</strong> {r.adminResponse}
              </p>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {r.status !== "responded" && (
                <button onClick={() => respond(r.id)} className="btn-primary" style={{ height: 32, fontSize: 12 }}>
                  Respond
                </button>
              )}
              {r.status === "new" && (
                <button onClick={() => markReviewed(r.id)} className="btn-ghost" style={{ height: 32, fontSize: 12 }}>
                  Mark reviewed
                </button>
              )}
              {r.publicConsent && r.comment.length > 0 && !r.published && (
                <button
                  onClick={() => setPublished(r.id, true)}
                  className="btn-primary"
                  style={{ height: 32, fontSize: 12 }}
                >
                  Publish to site
                </button>
              )}
              {r.publicConsent && r.comment.length > 0 && !r.published && !r.rejectedAt && (
                <button
                  onClick={() => setPublished(r.id, false)}
                  className="btn-ghost"
                  style={{ height: 32, fontSize: 12 }}
                >
                  Do not publish
                </button>
              )}
              {r.published && (
                <button
                  onClick={() => setPublished(r.id, false)}
                  className="btn-ghost"
                  style={{ height: 32, fontSize: 12 }}
                >
                  Take down
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
