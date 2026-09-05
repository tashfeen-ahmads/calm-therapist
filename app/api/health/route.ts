import { NextResponse } from "next/server";
import { dbEnabled, prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Used by the host's health check. Reports whether the database answers. */
export async function GET() {
  let db: "ok" | "off" | "error" = "off";
  if (dbEnabled) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      db = "ok";
    } catch {
      db = "error";
    }
  }
  return NextResponse.json({ ok: db !== "error", db }, { status: db === "error" ? 503 : 200 });
}
