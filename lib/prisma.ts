/**
 * Prisma client singleton.
 *
 * The full app is designed to run two modes:
 *   - DB-backed: DATABASE_URL is set. All persistence goes through Prisma.
 *   - In-memory:  DATABASE_URL is missing. Each lib falls back to globalThis
 *                 maps so the demo continues to work without setup.
 *
 * `dbEnabled` lets each lib pick the right backend.
 */

import { PrismaClient } from "@prisma/client";
import { assertEnv } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var _calmPrisma: PrismaClient | undefined;
}

// Throws in production when DATABASE_URL is missing (unless ALLOW_MEMORY_STORE=1).
assertEnv();

export const dbEnabled = !!process.env.DATABASE_URL;

export const prisma: PrismaClient =
  globalThis._calmPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._calmPrisma = prisma;
}
