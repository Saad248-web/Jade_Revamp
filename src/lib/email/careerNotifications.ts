import { sendTransactionalEmail } from "@/lib/email/resendOutbound";
import { parseRecipients } from "@/lib/email/parseRecipients";

export async function notifyCareerApplication(params: {
  jobId: string;
  jobTitle: string;
  applyContext: string;
  sourcePage: string;
  applicantName: string;
  applicantEmail: string;
  applicationId: string;
}): Promise<void> {
  const to = parseRecipients(process.env.CAREERS_NOTIFY_EMAIL);
  if (to.length === 0) return;

  const r = await sendTransactionalEmail({
    to,
    subject: `[Jade careers] ${params.jobTitle} — ${params.jobId}`,
    text: [
      `New application submitted via the website.`,
      ``,
      `Application id: ${params.applicationId}`,
      `Role: ${params.jobTitle} (${params.jobId})`,
      `Context: ${params.applyContext}`,
      `Source page: ${params.sourcePage}`,
      `Name: ${params.applicantName}`,
      `Email: ${params.applicantEmail}`,
      ``,
      `Download résumé from Dashboard → Careers.`,
    ].join("\n"),
    replyTo: params.applicantEmail,
  });
  if (!r.sent) console.warn("[careers email]", r.reason);
}
