import { NextResponse } from "next/server";
import { publicHighlights } from "@/lib/feedback";

export const runtime = "nodejs";

export async function GET() {
  const items = publicHighlights(6).map((r) => ({
    name: r.userName,
    text: r.comment,
    rating: r.rating,
  }));
  return NextResponse.json({ items });
}
