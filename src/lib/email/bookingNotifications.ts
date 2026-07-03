import { createElement } from "react";
import { BookingConflictNotificationEmail } from "@/emails/BookingConflictNotification";
import { GuestBookingConfirmationEmail } from "@/emails/GuestBookingConfirmation";
import { StaffBookingNotificationEmail } from "@/emails/StaffBookingNotification";
import { formatBookingSource } from "@/lib/bookings/sourceLabels";
import { renderEmail } from "@/lib/email/renderEmail";
import { sendTransactionalEmail } from "@/lib/email/resendOutbound";
import {
  firstStaffRecipient,
  getStaffNotifyRecipients,
} from "@/lib/email/staffRecipients";
import { getSiteBaseUrl } from "@/lib/siteUrl";

export type BookingConfirmedEmailParams = {
  bookingId: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests?: number;
  totalPaise: number;
  paymentStatus: string;
  source?: string;
};

function formatInrFromPaise(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

function paymentStatusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Paid in full";
    case "deposit_paid":
      return "Deposit paid";
    case "external":
      return "External / offline payment";
    case "not_applicable":
      return "Complimentary / waived";
    case "pending":
      return "Payment pending";
    default:
      return status.replace(/_/g, " ");
  }
}

/** Staff + guest emails when a booking reaches confirmed status. */
export async function notifyBookingConfirmed(
  params: BookingConfirmedEmailParams,
): Promise<void> {
  const staffTo = getStaffNotifyRecipients();
  const skipGuestEmail =
    process.env.BOOKING_GUEST_CONFIRM_EMAIL === "false";
  const sourceLabel = formatBookingSource(params.source).label;
  const totalInr = formatInrFromPaise(params.totalPaise);
  const payLabel = paymentStatusLabel(params.paymentStatus);
  const dashboardUrl = `${getSiteBaseUrl()}/dashboard/bookings/${params.bookingId}`;
  const guestEmail = params.guestEmail?.trim().toLowerCase() ?? "";

  if (staffTo.length > 0) {
    const staffRendered = await renderEmail(
      createElement(StaffBookingNotificationEmail, {
        bookingId: params.bookingId,
        villaName: params.villaName,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guestName: params.guestName,
        guestEmail,
        guestPhone: params.guestPhone,
        guests: params.guests,
        totalInr,
        paymentStatus: payLabel,
        sourceLabel,
        dashboardUrl,
      }),
    );
    const r = await sendTransactionalEmail({
      to: staffTo,
      subject: `[Jade] Booking confirmed — ${params.villaName}`,
      text: staffRendered.text,
      html: staffRendered.html,
      replyTo: guestEmail || undefined,
    });
    if (!r.sent) console.warn("[booking email staff]", r.reason);
  }

  if (!skipGuestEmail && guestEmail) {
    const guestRendered = await renderEmail(
      createElement(GuestBookingConfirmationEmail, {
        guestName: params.guestName,
        bookingId: params.bookingId,
        villaName: params.villaName,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        paymentStatus: payLabel,
        totalInr,
        contactPhone: "+91 80 1234 5678",
        cancellationNote:
          "Cancellation terms apply as per your booking agreement. Contact us for changes.",
      }),
    );
    const r = await sendTransactionalEmail({
      to: [guestEmail],
      subject: `Your booking is confirmed — ${params.villaName}`,
      text: guestRendered.text,
      html: guestRendered.html,
      replyTo: firstStaffRecipient(),
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
  const to = getStaffNotifyRecipients();
  if (to.length === 0) return;

  const conflictsUrl = `${getSiteBaseUrl()}/dashboard/conflicts`;
  const rendered = await renderEmail(
    createElement(BookingConflictNotificationEmail, {
      ...params,
      conflictsUrl,
    }),
  );

  const r = await sendTransactionalEmail({
    to,
    subject: `[Jade] Booking conflict — ${params.villaName}`,
    text: rendered.text,
    html: rendered.html,
  });
  if (!r.sent) console.warn("[conflict email]", r.reason);
}
