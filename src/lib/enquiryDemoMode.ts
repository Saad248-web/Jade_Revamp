/**
 * Enquiry demo mode — UI/UX sign-off without Postgres.
 * Default: ON. Set NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false when Postgres + /api/leads are live.
 */
export function isEnquiryDemoMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_ENQUIRY_DEMO_MODE?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") return false;
  if (flag === "true" || flag === "1" || flag === "on") return true;
  return true;
}

/** Brief delay so submit buttons show a sending state in demos. */
export async function simulateEnquirySubmit(delayMs = 650): Promise<void> {
  await new Promise((r) => setTimeout(r, delayMs));
}
