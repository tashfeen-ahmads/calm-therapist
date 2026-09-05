/* eslint-disable no-console */
/**
 * Runs `prisma migrate deploy` before `next build` when a database is
 * configured. Skips cleanly when DATABASE_URL is absent (local builds, CI
 * without a database). Fails the build if migrations fail, so a deploy never
 * goes out against a schema it cannot use.
 */
const { spawnSync } = require("child_process");

// Prefer a direct (unpooled) connection for migrations when the host provides one.
const url =
  process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_DIRECT_URL ||
  process.env.DATABASE_URL ||
  process.env.NETLIFY_DB_URL ||
  process.env.NETLIFY_DATABASE_URL;

if (!url) {
  console.log("[migrate] no database URL set; skipping prisma migrate deploy.");
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DATABASE_URL: url },
});
process.exit(result.status ?? 1);
