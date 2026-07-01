import { sendTransactionalEmail } from "@/lib/email/resendOutbound";
import { parseRecipients } from "@/lib/email/parseRecipients";
import { leadSourceLabel } from "@/lib/leads/sourceLabels";

export async function notifyNewLead(params: {
  source: string;
  preview: string;
}): Promise<void> {
  const to = parseRecipients(process.env.LEADS_NOTIFY_EMAIL);
  if (to.length === 0) return;

  const r = await sendTransactionalEmail({
    to,
    subject: `[Jade lead] ${leadSourceLabel(params.source)}`,
    text: params.preview,
  });
  if (!r.sent) console.warn("[leads email]", r.reason);
}
