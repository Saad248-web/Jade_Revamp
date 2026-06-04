/**
 * Careers apply demo mode — success UI sign-off without Postgres.
 * Defaults ON (same as enquiry). Set NEXT_PUBLIC_CAREERS_DEMO_MODE=false when live.
 */
export function isCareersDemoMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_CAREERS_DEMO_MODE?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") return false;
  if (flag === "true" || flag === "1" || flag === "on") return true;
  const enquiry = process.env.NEXT_PUBLIC_ENQUIRY_DEMO_MODE?.trim().toLowerCase();
  if (enquiry === "false" || enquiry === "0" || enquiry === "off") return false;
  return true;
}

export async function simulateCareersApplySubmit(delayMs = 650): Promise<void> {
  await new Promise((r) => setTimeout(r, delayMs));
}
