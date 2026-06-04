/**
 * Enquiry demo mode — UI/UX sign-off without Postgres.
 * Default: ON. Set NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false when Postgres + /api/leads are live.
 *
 * Also gates Partner overlay (multipart `/api/leads/partner`) and careers apply
 * when their dedicated flags are unset — see `isPartnerDemoMode` / careersDemoMode.
 */
export function isEnquiryDemoMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_ENQUIRY_DEMO_MODE?.trim().toLowerCase();
  if (flag === "false" || flag === "0" || flag === "off") return false;
  if (flag === "true" || flag === "1" || flag === "on") return true;
  return true;
}

/** Partner with us — same demo gate as Enquire/Footer unless overridden later. */
export function isPartnerDemoMode(): boolean {
  return isEnquiryDemoMode();
}

/** Brief delay so submit buttons show a sending state in demos. */
export async function simulateEnquirySubmit(delayMs = 650): Promise<void> {
  await new Promise((r) => setTimeout(r, delayMs));
}
