import { Text } from "@react-email/components";
import { JadeEmailLayout } from "./components/JadeEmailLayout";

export type LeadNotificationProps = {
  sourceLabel: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate?: string;
  dashboardUrl?: string;
};

export function LeadNotificationEmail(props: LeadNotificationProps) {
  return (
    <JadeEmailLayout
      preview={`New enquiry — ${props.sourceLabel}`}
      title={`New enquiry — ${props.sourceLabel}`}
    >
      <Text>A new enquiry was submitted on the website.</Text>
      <Text>
        <strong>Name:</strong> {props.name || "—"}
        <br />
        <strong>Email:</strong> {props.email || "—"}
        <br />
        <strong>Phone:</strong> {props.phone || "—"}
        {props.preferredDate ? (
          <>
            <br />
            <strong>Preferred date:</strong> {props.preferredDate}
          </>
        ) : null}
      </Text>
      <Text>
        <strong>Message / details:</strong>
        <br />
        {props.message || "(none)"}
      </Text>
      {props.dashboardUrl ? (
        <Text>View in dashboard: {props.dashboardUrl}</Text>
      ) : null}
    </JadeEmailLayout>
  );
}
