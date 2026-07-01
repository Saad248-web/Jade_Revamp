import { sendTransactionalEmail } from "@/lib/email/resendOutbound";
import {
  firstRecipient,
  parseRecipients,
} from "@/lib/email/parseRecipients";

export async function notifyBookingCreated(params: {
  bookingId: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
}): Promise<void> {
  const staffTo = parseRecipients(process.env.BOOKING_NOTIFY_EMAIL);
  const skipGuestEmail =
    process.env.BOOKING_GUEST_CONFIRM_EMAIL === "false";

  const block = [
    `Reference: ${params.bookingId}`,
    `Villa: ${params.villaName}`,
    `Check-in → check-out: ${params.checkIn} → ${params.checkOut}`,
    `Guest: ${params.guestName}`,
    `Email: ${params.guestEmail}`,
    `Phone: ${params.guestPhone}`,
    `Total (as submitted): ₹${params.totalPrice}`,
  ].join("\n");

  if (staffTo.length > 0) {
    const r = await sendTransactionalEmail({
      to: staffTo,
      subject: `[Jade] New booking ${params.bookingId.slice(0, 8)} — ${params.villaName}`,
      text: `New booking captured in the system.\n\n${block}`,
      replyTo: params.guestEmail,
    });
    if (!r.sent) console.warn("[booking email staff]", r.reason);
  }

  if (!skipGuestEmail && params.guestEmail) {
    const r = await sendTransactionalEmail({
      to: [params.guestEmail],
      subject: `We received your booking — ${params.villaName}`,
      text: [
        `Dear ${params.guestName},`,
        ``,
        `Thank you. We've received your booking request with the following details:`,
        ``,
        block,
        ``,
        `Our team may contact you shortly to confirm or complete formalities.`,
        ``,
        `— Jade Hospitainment`,
      ].join("\n"),
      replyTo: firstRecipient(process.env.BOOKING_NOTIFY_EMAIL),
    });
    if (!r.sent) console.warn("[booking email guest]", r.reason);
  }
}

export async function notifyBookingConflict(params: {
  bookingId: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  source: string;
  reason?: string;
}): Promise<void> {
  const to =
    parseRecipients(process.env.CONFLICT_NOTIFY_EMAIL).length > 0
      ? parseRecipients(process.env.CONFLICT_NOTIFY_EMAIL)
      : parseRecipients(process.env.BOOKING_NOTIFY_EMAIL);
  if (to.length === 0) return;

  const r = await sendTransactionalEmail({
    to,
    subject: `[Jade] Booking conflict — ${params.villaName}`,
    text: [
      `A booking conflict needs staff attention.`,
      ``,
      `Booking id: ${params.bookingId}`,
      `Villa: ${params.villaName}`,
      `Dates: ${params.checkIn} → ${params.checkOut}`,
      `Guest: ${params.guestName}`,
      `Source: ${params.source}`,
      params.reason ? `Reason: ${params.reason}` : "",
      ``,
      `Open the Conflicts page in Jade Host to resolve.`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
  if (!r.sent) console.warn("[conflict email]", r.reason);
}
