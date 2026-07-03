import { Text } from "@react-email/components";
import { JadeEmailLayout } from "./components/JadeEmailLayout";

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
  const shortId = props.bookingId.slice(0, 8);
  return (
    <JadeEmailLayout
      preview={`Booking confirmed — ${props.villaName}`}
      title={`Booking confirmed — ${props.villaName}`}
    >
      <Text>A new booking is confirmed in Jade Host.</Text>
      <Text>
        <strong>Reference:</strong> {props.bookingId}
        <br />
        <strong>Villa:</strong> {props.villaName}
        <br />
        <strong>Check-in → check-out:</strong> {props.checkIn} → {props.checkOut}
        <br />
        <strong>Guest:</strong> {props.guestName}
        <br />
        <strong>Email:</strong> {props.guestEmail || "(not provided)"}
        <br />
        <strong>Phone:</strong> {props.guestPhone || "(not provided)"}
        {props.guests != null ? (
          <>
            <br />
            <strong>Guests:</strong> {props.guests}
          </>
        ) : null}
        <br />
        <strong>Total:</strong> {props.totalInr}
        <br />
        <strong>Payment:</strong> {props.paymentStatus}
        <br />
        <strong>Source:</strong> {props.sourceLabel}
      </Text>
      {props.dashboardUrl ? (
        <Text>
          Open folio: {props.dashboardUrl}
        </Text>
      ) : null}
      <Text style={{ color: "#5c5c5c", fontSize: "13px" }}>
        Ref {shortId} · Reply to reach the guest directly.
      </Text>
    </JadeEmailLayout>
  );
}
