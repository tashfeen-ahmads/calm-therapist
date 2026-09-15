import { NextResponse } from "next/server";
import { publicHighlights, publicRating } from "@/lib/feedback";

export const runtime = "nodejs";

/**
 * Approved reviews for the public site.
 *
 * The homepage is served by Netlify, which has no database credentials by
 * design, so it reads this endpoint through the proxy to Render rather than
 * querying Postgres itself. That keeps the credentials in one place and still
 * puts the words in the server-rendered HTML, which is the point: a review
 * that only appears after a client-side fetch is invisible to search.
 */
export async function GET() {
  const [list, rating] = await Promise.all([publicHighlights(6), publicRating()]);
  return NextResponse.json(
    {
      items: list.map((r) => ({
        id: r.id,
        name: r.userName.split(" ")[0],
        text: r.comment,
        rating: r.rating,
        createdAt: r.createdAt,
      })),
      rating,
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}
