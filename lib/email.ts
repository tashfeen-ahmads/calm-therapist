/**
 * Email send wrapper. If RESEND_API_KEY is set, real emails go through Resend.
 * If not, we just log — useful for dev. Swappable for SendGrid/Postmark later
 * by replacing this single function.
 */

interface SendOpts {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

const FROM_DEFAULT = process.env.EMAIL_FROM ?? "Aura at Calm Therapist <hello@calmtherapist.implenix.net>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "hello@calmtherapist.implenix.net";

export async function sendEmail(opts: SendOpts): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email-mock] → ${opts.to}\n  subject: ${opts.subject}\n  preview: ${opts.text?.slice(0, 200) ?? opts.html.slice(0, 200)}`);
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: opts.from ?? FROM_DEFAULT,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        reply_to: REPLY_TO,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error", res.status, detail);
      return { ok: false, error: `Resend ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend exception", err);
    return { ok: false, error: (err as Error).message };
  }
}
