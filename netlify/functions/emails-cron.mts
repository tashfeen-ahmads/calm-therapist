import type { Config } from "@netlify/functions";

/**
 * Drains the lifecycle email queue every five minutes by calling the app's
 * own cron endpoint with the shared secret. Runs only on published deploys.
 */
export default async (req: Request) => {
  const { next_run } = await req.json().catch(() => ({ next_run: "unknown" }));
  const base = Netlify.env.get("URL");
  const secret = Netlify.env.get("CRON_SECRET");
  if (!base || !secret) {
    console.warn("[emails-cron] URL or CRON_SECRET missing; skipping");
    return;
  }
  const res = await fetch(`${base}/api/cron/emails`, {
    method: "POST",
    headers: { "x-cron-secret": secret },
  });
  console.log(`[emails-cron] ${res.status}; next run ${next_run}`);
};

export const config: Config = {
  schedule: "*/5 * * * *",
};
