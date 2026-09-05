/* eslint-disable no-console */
/**
 * Runs `prisma migrate deploy` before `next build` when a database is
 * configured. Skips cleanly when DATABASE_URL is absent (local builds, CI
 * without a database). Fails the build if migrations fail, so a deploy never
 * goes out against a schema it cannot use.
 */
const { spawnSync } = require("child_process");

if (!process.env.DATABASE_URL) {
  console.log("[migrate] DATABASE_URL not set; skipping prisma migrate deploy.");
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit", shell: true });
process.exit(result.status ?? 1);
