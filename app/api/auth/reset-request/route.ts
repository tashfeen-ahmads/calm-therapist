import { NextResponse } from "next/server";
import { setResetToken } from "@/lib/users";
import { sendEmail } from "@/lib/email";
import { getTemplate } from "@/lib/email-templates";
import { identifierFor, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmtherapist.implenix.net";

/**
 * Issue a password-reset link. Always returns 200 (even if the email isn't
 * registered) so this endpoint can't be used to enumerate accounts. Rate-
 * limited so a script can't fire reset emails at every address it knows.
 */
export async function POST(req: Request) {
  const id = identifierFor(req);
  const minute = rateLimit(id, { bucket: "reset:min", windowSec: 60, max: 3 });
  if (!minute.allowed) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  const hour = rateLimit(id, { bucket: "reset:hour", windowSec: 60 * 60, max: 10 });
  if (!hour.allowed) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const email = (body.email ?? "").trim();
  if (!email) return NextResponse.json({ ok: true });

  const issued = await setResetToken(email);
  if (issued) {
    const actionUrl = `${APP_URL}/auth/reset?token=${encodeURIComponent(issued.token)}`;
    const built = getTemplate("password-reset").build({
      name: issued.user.name,
      email: issued.user.email,
      appUrl: APP_URL,
      actionUrl,
    });
    await sendEmail({
      to: issued.user.email,
      subject: built.subject,
      html: built.html,
      text: built.text,
    });
  }
  return NextResponse.json({ ok: true });
}
