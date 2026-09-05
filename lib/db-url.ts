/**
 * Hosts that provision a database for you export it under their own name.
 * Netlify DB gives NETLIFY_DATABASE_URL (pooled) and
 * NETLIFY_DATABASE_URL_UNPOOLED (direct). Prisma reads DATABASE_URL, so this
 * fills it in when it is missing. Node runtime only; never import from edge code.
 */
export function resolveDatabaseUrl(): void {
  if (process.env.DATABASE_URL) return;
  const pooled = process.env.NETLIFY_DATABASE_URL;
  if (!pooled) return;
  // Neon's pooler runs PgBouncer in transaction mode; Prisma needs to know.
  process.env.DATABASE_URL = pooled.includes("pgbouncer=") ? pooled : `${pooled}${pooled.includes("?") ? "&" : "?"}pgbouncer=true`;
}

/** The URL migrations should use: a direct connection when the host offers one. */
export function migrationDatabaseUrl(): string | undefined {
  return process.env.NETLIFY_DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;
}
