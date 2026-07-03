import { Text } from "@react-email/components";
import { JadeEmailLayout } from "./components/JadeEmailLayout";

export type CareerApplicationNotificationProps = {
  applicationId: string;
  jobTitle: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  phone: string;
  company?: string;
  dashboardUrl?: string;
  resumeAttached: boolean;
};

export function CareerApplicationNotificationEmail(
  props: CareerApplicationNotificationProps,
) {
  return (
    <JadeEmailLayout
      preview={`Careers application — ${props.jobTitle}`}
      title={`Careers application — ${props.jobTitle}`}
    >
      <Text>A new careers application was submitted.</Text>
      <Text>
        <strong>Application ID:</strong> {props.applicationId}
        <br />
        <strong>Role:</strong> {props.jobTitle} ({props.jobId})
        <br />
        <strong>Name:</strong> {props.applicantName}
        <br />
        <strong>Email:</strong> {props.applicantEmail}
        <br />
        <strong>Phone:</strong> {props.phone || "—"}
        {props.company ? (
          <>
            <br />
            <strong>Company:</strong> {props.company}
          </>
        ) : null}
      </Text>
      <Text>
        {props.resumeAttached
          ? "Résumé is attached to this email."
          : "Résumé is available in the dashboard."}
      </Text>
      {props.dashboardUrl ? (
        <Text>Download résumé: {props.dashboardUrl}</Text>
      ) : null}
    </JadeEmailLayout>
  );
}
