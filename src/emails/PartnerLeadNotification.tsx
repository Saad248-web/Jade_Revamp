import { Text } from "@react-email/components";
import { JadeEmailLayout } from "./components/JadeEmailLayout";

export type PartnerLeadNotificationProps = {
  partnerLeadId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  details: string;
  photoCount: number;
  photosAttached: number;
  dashboardUrl?: string;
};

export function PartnerLeadNotificationEmail(props: PartnerLeadNotificationProps) {
  return (
    <JadeEmailLayout
      preview="New partner programme enquiry"
      title="Partner with us — new submission"
    >
      <Text>A new partner programme enquiry was submitted.</Text>
      <Text>
        <strong>Lead ID:</strong> {props.partnerLeadId}
        <br />
        <strong>Name:</strong> {props.name}
        <br />
        <strong>Email:</strong> {props.email}
        <br />
        <strong>Phone:</strong> {props.phone || "—"}
        <br />
        <strong>Company:</strong> {props.company || "—"}
      </Text>
      <Text>
        <strong>Details:</strong>
        <br />
        {props.details}
      </Text>
      <Text>
        Photos uploaded: {props.photoCount}
        {props.photosAttached > 0
          ? ` (${props.photosAttached} attached to this email)`
          : " (view all in dashboard)"}
      </Text>
      {props.dashboardUrl ? (
        <Text>View in dashboard: {props.dashboardUrl}</Text>
      ) : null}
    </JadeEmailLayout>
  );
}
