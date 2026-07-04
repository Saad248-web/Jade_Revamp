import { Text } from "@react-email/components";
import { EmailDetailTable } from "./components/EmailDetailTable";
import { JadeEmailLayout } from "./components/JadeEmailLayout";
import { emailColors } from "./components/emailTokens";

export type GuestBookingConfirmationProps = {
  guestName: string;
  bookingId: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  paymentStatus: string;
  totalInr: string;
  contactPhone?: string;
  mapsUrl?: string;
  cancellationNote?: string;
};

export function GuestBookingConfirmationEmail(
  props: GuestBookingConfirmationProps,
) {
  const shortRef = props.bookingId.slice(0, 8).toUpperCase();

  return (
    <JadeEmailLayout
      preview={`Your stay at ${props.villaName} is confirmed`}
      eyebrow="Booking confirmed"
      title={`See you at ${props.villaName}`}
    >
      <Text style={greeting}>Dear {props.guestName},</Text>
      <Text style={intro}>
        Thank you for choosing Jade Retreats. Your private villa reservation is
        confirmed — we look forward to hosting you.
      </Text>
      <EmailDetailTable
        rows={[
          { label: "Reference", value: shortRef },
          { label: "Property", value: props.villaName },
          { label: "Check-in", value: props.checkIn },
          { label: "Check-out", value: props.checkOut },
          { label: "Payment", value: props.paymentStatus },
          { label: "Total", value: props.totalInr },
        ]}
      />
      {props.mapsUrl ? (
        <Text style={linkLine}>
          <strong>Directions:</strong>{" "}
          <a href={props.mapsUrl} style={link}>
            View on Google Maps
          </a>
        </Text>
      ) : null}
      {props.contactPhone ? (
        <Text style={contact}>
          Questions before you arrive? Call us at{" "}
          <a href={`tel:${props.contactPhone.replace(/\s/g, "")}`} style={link}>
            {props.contactPhone}
          </a>
          .
        </Text>
      ) : null}
      {props.cancellationNote ? (
        <Text style={finePrint}>{props.cancellationNote}</Text>
      ) : null}
      <Text style={signoff}>Warm regards,</Text>
      <Text style={signoffName}>The Jade Retreats team</Text>
    </JadeEmailLayout>
  );
}

const greeting = {
  color: emailColors.text,
  fontSize: "16px",
  margin: "0 0 12px",
};

const intro = {
  color: emailColors.text,
  fontSize: "15px",
  lineHeight: "1.65",
  margin: "0 0 8px",
};

const linkLine = {
  fontSize: "14px",
  margin: "16px 0 0",
};

const link = {
  color: emailColors.jadeGreen,
};

const contact = {
  fontSize: "15px",
  margin: "16px 0 0",
};

const finePrint = {
  fontSize: "13px",
  color: emailColors.textMuted,
  lineHeight: "1.5",
  margin: "20px 0 0",
};

const signoff = {
  fontSize: "15px",
  margin: "28px 0 4px",
};

const signoffName = {
  fontSize: "15px",
  color: emailColors.jadeDeep,
  fontWeight: "600" as const,
  margin: 0,
};
