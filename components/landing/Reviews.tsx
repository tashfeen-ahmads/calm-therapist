import { JsonLd, aggregateRatingSchema } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

/**
 * What members actually said.
 *
 * Server-rendered so the words are in the HTML for search and for answer
 * engines, rather than arriving later by fetch. Every quote here has been
 * approved by a person: the member ticked the box, and an admin read it.
 *
 * Renders nothing at all when there is nothing approved. An empty
 * "testimonials" section with placeholder quotes is worse than no section,
 * and a rating computed from two reviews is not a rating.
 */
interface Highlight {
  id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: string;
}

async function load(): Promise<{ items: Highlight[]; rating: { ratingValue: number; reviewCount: number } | null }> {
  try {
    const res = await fetch(`${BRAND.url}/api/feedback/highlights`, { next: { revalidate: 900 } });
    if (!res.ok) return { items: [], rating: null };
    return await res.json();
  } catch {
    // The backend may not be reachable during a build. Render nothing rather
    // than failing the page.
    return { items: [], rating: null };
  }
}

export async function Reviews() {
  const { items, rating } = await load();
  if (items.length === 0) return null;

  const aggregate = rating ? aggregateRatingSchema(rating) : null;

  return (
    <section style={{ background: "var(--calm-white)", padding: "120px 24px" }}>
      {aggregate && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: BRAND.name,
            description: BRAND.description,
            aggregateRating: aggregate,
            review: items.map((r) => ({
              "@type": "Review",
              reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
              author: { "@type": "Person", name: r.name },
              reviewBody: r.text,
              datePublished: r.createdAt.slice(0, 10),
            })),
          }}
        />
      )}

      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 48px" }}>
          <span className="micro-label" style={{ color: "var(--calm-forest)" }}>In their words</span>
          <h2 style={{ marginTop: 16, marginBottom: 16 }}>What members say.</h2>
          {rating && (
            <p className="body-large" style={{ color: "var(--calm-ink-70)" }}>
              {rating.ratingValue.toFixed(1)} out of 5, from {rating.reviewCount}{" "}
              {rating.reviewCount === 1 ? "member" : "members"} who chose to be quoted.
            </p>
          )}
        </div>

        <div className="reviews-grid">
          {items.map((r) => (
            <figure key={r.id} className="card" style={{ padding: 28, margin: 0 }}>
              <span
                aria-label={`${r.rating} out of 5`}
                style={{ color: "var(--calm-forest)", fontSize: 15, letterSpacing: 2 }}
              >
                {"★".repeat(r.rating)}
                <span style={{ color: "var(--calm-ink-10)" }}>{"★".repeat(5 - r.rating)}</span>
              </span>
              <blockquote style={{ margin: "14px 0 16px", fontSize: 16, lineHeight: 1.8, color: "var(--calm-ink)" }}>
                {r.text}
              </blockquote>
              <figcaption style={{ fontSize: 13, color: "var(--calm-ink-40)" }}>{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <style>{`
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1040px;
          margin: 0 auto;
        }
        @media (max-width: 900px) { .reviews-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .reviews-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
