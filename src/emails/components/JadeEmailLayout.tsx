import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

type JadeEmailLayoutProps = {
  preview: string;
  title: string;
  children: ReactNode;
};

export function JadeEmailLayout({
  preview,
  title,
  children,
}: JadeEmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>{title}</Heading>
          <Section style={section}>{children}</Section>
          <Hr style={hr} />
          <Text style={footer}>Jade Hospitainment · jaderetreats.com</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f4f4f0",
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "24px auto",
  padding: "32px 28px",
  maxWidth: "560px",
  borderRadius: "4px",
};

const heading = {
  color: "#0d5c4b",
  fontSize: "22px",
  fontWeight: "600" as const,
  margin: "0 0 20px",
};

const section = {
  color: "#1a1c1e",
  fontSize: "15px",
  lineHeight: "1.55",
};

const hr = {
  borderColor: "#e0e0e0",
  margin: "28px 0 16px",
};

const footer = {
  color: "#5c5c5c",
  fontSize: "12px",
  margin: 0,
};
