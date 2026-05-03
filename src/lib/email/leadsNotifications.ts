import { sendTransactionalEmail } from "@/lib/email/resendOutbound";

export async function notifyNewLead(params: {
  source: string;
  preview: string;
}): Promise<void> {
  const to = process.env.LEADS_NOTIFY_EMAIL?.trim();
  if (!to) return;

  const r = await sendTransactionalEmail({
    to: [to],
    subject: `[Jade lead] ${params.source}`,
    text: params.preview,
  });
  if (!r.sent) console.warn("[leads email]", r.reason);
}
