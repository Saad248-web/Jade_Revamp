// Route-segment layout — Server Component exports metadata for this client-component page
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Corporate Retreats",
  description:
    "Exclusive private villa buyouts near Bangalore for corporate offsites, team building, and strategic retreats. Trusted by Google, Microsoft, IBM & more.",
  alternates: { canonical: "https://jadehospitainment.com/corporate-retreats" },
  openGraph: {
    title: "Corporate Retreats | Jade Hospitainment",
    description:
      "Private villa offsites near Bangalore — focused sessions, team alignment, and meaningful downtime. Exclusively for groups.",
    url: "https://jadehospitainment.com/corporate-retreats",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://jadehospitainment.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Corporate Retreats",
      item: "https://jadehospitainment.com/corporate-retreats",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Corporate Retreats — Jade Hospitainment",
  description:
    "Exclusive private villa buyouts near Bangalore designed for focused corporate offsites, team building, and strategic retreats.",
  provider: {
    "@type": "Organization",
    name: "Jade Hospitainment",
    url: "https://jadehospitainment.com",
  },
  areaServed: { "@type": "Place", name: "Bangalore, India" },
};

export default function CorporateRetreatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={serviceSchema} />
      {children}
    </>
  );
}
