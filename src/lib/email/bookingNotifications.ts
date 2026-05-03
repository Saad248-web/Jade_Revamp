import { sendTransactionalEmail } from "@/lib/email/resendOutbound";

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
  const staffTo = process.env.BOOKING_NOTIFY_EMAIL?.trim();
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

  if (staffTo) {
    const r = await sendTransactionalEmail({
      to: [staffTo],
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
      replyTo: staffTo,
    });
    if (!r.sent) console.warn("[booking email guest]", r.reason);
  }
}
