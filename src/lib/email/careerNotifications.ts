import { sendTransactionalEmail } from "@/lib/email/resendOutbound";

export async function notifyCareerApplication(params: {
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  applicationId: string;
}): Promise<void> {
  const to = process.env.CAREERS_NOTIFY_EMAIL?.trim();
  if (!to) return;

  const r = await sendTransactionalEmail({
    to: [to],
    subject: `[Jade careers] Application — ${params.jobId}`,
    text: [
      `New application submitted via the website.`,
      ``,
      `Application id: ${params.applicationId}`,
      `Role slug: ${params.jobId}`,
      `Name: ${params.applicantName}`,
      `Email: ${params.applicantEmail}`,
      ``,
      `Download résumé from admin or database (resume_bytes on career_applications).`,
    ].join("\n"),
    replyTo: params.applicantEmail,
  });
  if (!r.sent) console.warn("[careers email]", r.reason);
}
