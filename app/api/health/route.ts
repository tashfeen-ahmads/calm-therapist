import { NextResponse } from "next/server";
import { DATABASE_URL_NAMES } from "@/lib/db-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Used by the host's health check and by humans after a deploy. Never
 * throws: when the app refuses to start it says why, so the fix is obvious.
 */
export async function GET() {
  const env = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    ADMIN_INITIAL_PASSWORD: !!process.env.ADMIN_INITIAL_PASSWORD,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    ELEVENLABS_API_KEY: !!process.env.ELEVENLABS_API_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    database: DATABASE_URL_NAMES.find((n) => !!process.env[n]) ?? null,
  };

  let db: "ok" | "off" | "error" = "off";
  let error: string | undefined;
  try {
    // Imported lazily: the Prisma module enforces required env at load time.
    const { dbEnabled, prisma } = await import("@/lib/prisma");
    if (dbEnabled) {
      await prisma.$queryRaw`SELECT 1`;
      db = "ok";
    }
  } catch (err) {
    db = "error";
    error = (err as Error).message.split("\n")[0].slice(0, 300);
  }

  const ok = db === "ok";
  return NextResponse.json({ ok, db, error, env }, { status: ok ? 200 : 503 });
}
