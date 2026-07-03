import { Text } from "@react-email/components";
import { JadeEmailLayout } from "./components/JadeEmailLayout";

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
  return (
    <JadeEmailLayout
      preview={`Your booking at ${props.villaName} is confirmed`}
      title="Your booking is confirmed"
    >
      <Text>Dear {props.guestName},</Text>
      <Text>
        Thank you for choosing Jade Hospitainment. Your reservation is
        confirmed.
      </Text>
      <Text>
        <strong>Reference:</strong> {props.bookingId}
        <br />
        <strong>Property:</strong> {props.villaName}
        <br />
        <strong>Check-in:</strong> {props.checkIn}
        <br />
        <strong>Check-out:</strong> {props.checkOut}
        <br />
        <strong>Payment status:</strong> {props.paymentStatus}
        <br />
        <strong>Total:</strong> {props.totalInr}
      </Text>
      {props.mapsUrl ? (
        <Text>
          <strong>Location:</strong> {props.mapsUrl}
        </Text>
      ) : null}
      {props.contactPhone ? (
        <Text>
          Questions? Call us at {props.contactPhone}.
        </Text>
      ) : null}
      {props.cancellationNote ? (
        <Text style={{ fontSize: "13px", color: "#5c5c5c" }}>
          {props.cancellationNote}
        </Text>
      ) : null}
      <Text>We look forward to hosting you.</Text>
      <Text>— Jade Hospitainment</Text>
    </JadeEmailLayout>
  );
}
