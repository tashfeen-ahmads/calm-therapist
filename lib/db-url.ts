/**
 * Hosts that provision a database for you export it under their own name.
 * Netlify DB injects NETLIFY_DB_URL at runtime and build time. Prisma reads
 * DATABASE_URL, so this fills it in when it is missing. Node runtime only;
 * never import from edge code.
 */
const HOST_URL_NAMES = ["NETLIFY_DB_URL", "NETLIFY_DATABASE_URL"] as const;

function hostDatabaseUrl(): string | undefined {
  for (const name of HOST_URL_NAMES) {
    const v = process.env[name];
    if (v) return v;
  }
  return undefined;
}

/** Neon's pooler runs PgBouncer in transaction mode; Prisma needs the flag. */
function withPoolerFlag(url: string): string {
  if (url.includes("pgbouncer=")) return url;
  const pooled = url.includes("-pooler.");
  if (!pooled) return url;
  return `${url}${url.includes("?") ? "&" : "?"}pgbouncer=true`;
}

export function resolveDatabaseUrl(): void {
  if (process.env.DATABASE_URL) return;
  const host = hostDatabaseUrl();
  if (host) process.env.DATABASE_URL = withPoolerFlag(host);
}

/** The URL migrations should use: a direct connection when the host offers one. */
export function migrationDatabaseUrl(): string | undefined {
  return (
    process.env.NETLIFY_DATABASE_URL_UNPOOLED ??
    process.env.DATABASE_DIRECT_URL ??
    process.env.DATABASE_URL ??
    hostDatabaseUrl()
  );
}

/** Names the app will accept for the database, for diagnostics. */
export const DATABASE_URL_NAMES = ["DATABASE_URL", ...HOST_URL_NAMES] as const;
