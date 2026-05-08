import { NextResponse } from "next/server";
import { publicHighlights } from "@/lib/feedback";

export const runtime = "nodejs";

export async function GET() {
  const list = await publicHighlights(6);
  const items = list.map((r) => ({
    name: r.userName,
    text: r.comment,
    rating: r.rating,
  }));
  return NextResponse.json({ items });
}
