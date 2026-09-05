import { NextResponse } from "next/server";
import { setEmailOptOutByToken } from "@/lib/users";
import { cancelPendingFor } from "@/lib/email-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE = (title: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2D2D2D}
main{max-width:520px;margin:12vh auto;padding:32px;background:#fff;border:1px solid rgba(45,45,45,.1);border-radius:14px}
h1{font-family:Georgia,serif;font-weight:500;font-size:26px;margin:0 0 12px}p{line-height:1.7;font-size:16px}a{color:#4A7A6D}</style></head>
<body><main><h1>${title}</h1>${body}</main></body></html>`;

async function handle(token: string | null) {
  if (!token) return new NextResponse(PAGE("That link didn't work", "<p>The unsubscribe link is missing its token. You can turn check-ins off from Settings inside the app.</p>"), { status: 400, headers: { "Content-Type": "text/html" } });
  const user = await setEmailOptOutByToken(token);
  if (!user) return new NextResponse(PAGE("That link didn't work", "<p>We couldn't find an account for this link. You can turn check-ins off from Settings inside the app.</p>"), { status: 404, headers: { "Content-Type": "text/html" } });
  await cancelPendingFor(user.id);
  return new NextResponse(PAGE("You're unsubscribed", "<p>No more check-ins or updates. Account emails such as password resets will still arrive when you ask for them.</p><p>Your space stays open. Come back whenever you like.</p>"), { headers: { "Content-Type": "text/html" } });
}

/** One-click unsubscribe (List-Unsubscribe-Post) lands here. */
export async function POST(req: Request) {
  const url = new URL(req.url);
  return handle(url.searchParams.get("t"));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return handle(url.searchParams.get("t"));
}
