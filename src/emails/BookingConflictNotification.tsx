import { Text } from "@react-email/components";
import { JadeEmailLayout } from "./components/JadeEmailLayout";

export type BookingConflictNotificationProps = {
  bookingId: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  source: string;
  reason?: string;
  conflictsUrl?: string;
};

export function BookingConflictNotificationEmail(
  props: BookingConflictNotificationProps,
) {
  return (
    <JadeEmailLayout
      preview={`Booking conflict — ${props.villaName}`}
      title={`Booking conflict — ${props.villaName}`}
    >
      <Text>
        A booking conflict needs staff attention. Please resolve in Jade Host.
      </Text>
      <Text>
        <strong>Booking ID:</strong> {props.bookingId}
        <br />
        <strong>Villa:</strong> {props.villaName}
        <br />
        <strong>Dates:</strong> {props.checkIn} → {props.checkOut}
        <br />
        <strong>Guest:</strong> {props.guestName}
        <br />
        <strong>Source:</strong> {props.source}
        {props.reason ? (
          <>
            <br />
            <strong>Reason:</strong> {props.reason}
          </>
        ) : null}
      </Text>
      {props.conflictsUrl ? (
        <Text>Open conflicts: {props.conflictsUrl}</Text>
      ) : (
        <Text>Open Dashboard → Conflicts to resolve.</Text>
      )}
    </JadeEmailLayout>
  );
}
