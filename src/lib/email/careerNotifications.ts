import { sendTransactionalEmail } from "@/lib/email/resendOutbound";

export async function notifyCareerApplication(params: {
  jobId: string;
  jobTitle: string;
  applyContext: string;
  sourcePage: string;
  applicantName: string;
  applicantEmail: string;
  applicationId: string;
}): Promise<void> {
  const to = process.env.CAREERS_NOTIFY_EMAIL?.trim();
  if (!to) return;

  const r = await sendTransactionalEmail({
    to: [to],
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
      `Download résumé from admin or database (resume_bytes on career_applications).`,
      `Filter: SELECT * FROM career_applications WHERE job_id = '${params.jobId}' ORDER BY created_at DESC;`,
    ].join("\n"),
    replyTo: params.applicantEmail,
  });
  if (!r.sent) console.warn("[careers email]", r.reason);
}
