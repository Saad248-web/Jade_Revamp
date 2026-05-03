/**
 * Sends email via Resend HTTP API — no SDK dependency.
 * If RESEND_API_KEY is unset, callers should treat inserts as source of truth and log.
 */

export type SendEmailInput = {
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendTransactionalEmail(
  input: SendEmailInput,
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }

  const from =
    process.env.RESEND_FROM?.trim() ||
    "Jade Hospitainment <onboarding@resend.dev>";

  const body: Record<string, unknown> = {
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
  };
  if (input.replyTo) body.reply_to = input.replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errTxt = await res.text().catch(() => "");
    return {
      sent: false,
      reason: errTxt.slice(0, 500) || `Resend HTTP ${res.status}`,
    };
  }

  return { sent: true };
}
