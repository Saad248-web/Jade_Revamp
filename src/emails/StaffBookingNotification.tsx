import { Text } from "@react-email/components";
import { EmailButton } from "./components/EmailButton";
import { EmailDetailTable } from "./components/EmailDetailTable";
import { JadeEmailLayout } from "./components/JadeEmailLayout";
import { emailColors } from "./components/emailTokens";

export type StaffBookingNotificationProps = {
  bookingId: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests?: number;
  totalInr: string;
  paymentStatus: string;
  sourceLabel: string;
  dashboardUrl?: string;
};

export function StaffBookingNotificationEmail(
  props: StaffBookingNotificationProps,
) {
  const shortId = props.bookingId.slice(0, 8).toUpperCase();
  const rows = [
    { label: "Reference", value: shortId },
    { label: "Villa", value: props.villaName },
    { label: "Stay", value: `${props.checkIn} → ${props.checkOut}` },
    { label: "Guest", value: props.guestName },
    { label: "Email", value: props.guestEmail || "(not provided)" },
    { label: "Phone", value: props.guestPhone || "(not provided)" },
  ];
  if (props.guests != null) {
    rows.push({ label: "Guests", value: String(props.guests) });
  }
  rows.push(
    { label: "Total", value: props.totalInr },
    { label: "Payment", value: props.paymentStatus },
    { label: "Source", value: props.sourceLabel },
  );

  return (
    <JadeEmailLayout
      preview={`Booking confirmed — ${props.villaName}`}
      eyebrow="Booking confirmed"
      title={props.villaName}
    >
      <Text style={intro}>
        A new stay is confirmed in Jade Host. Use reply-to on this thread to
        reach the guest.
      </Text>
      <EmailDetailTable rows={rows} />
      {props.dashboardUrl ? (
        <>
          <Text style={ctaHint}>Full folio, payments, and notes in dashboard.</Text>
          <EmailButton href={props.dashboardUrl} label="Open booking folio" />
        </>
      ) : null}
      <Text style={finePrint}>Booking ID {props.bookingId}</Text>
    </JadeEmailLayout>
  );
}

const intro = {
  color: emailColors.text,
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 4px",
};

const ctaHint = {
  color: emailColors.textMuted,
  fontSize: "14px",
  margin: "24px 0 0",
};

const finePrint = {
  color: emailColors.textMuted,
  fontSize: "12px",
  margin: "20px 0 0",
};
