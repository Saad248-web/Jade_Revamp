// Route-segment layout — Server Component exports metadata for this client-component page
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Weekend Getaways",
  description:
    "Escape the city to Jade's private Luxury Villas near Bangalore — poolside mornings, bonfire nights, outdoor dining, and peaceful weekend getaways with friends and family.",
  alternates: { canonical: "https://jadehospitainment.com/weekend-getaways" },
  openGraph: {
    title: "Weekend Getaways | Jade Hospitainment",
    description:
      "Private Villas for relaxed weekend escapes, small celebrations, and memorable getaways near Bangalore.",
    url: "https://jadehospitainment.com/weekend-getaways",
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
      name: "Weekend Getaways",
      item: "https://jadehospitainment.com/weekend-getaways",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Weekend Getaways — Jade Hospitainment",
  description:
    "Private luxury villa weekend escapes near Bangalore for friends and families seeking privacy, relaxation, and curated experiences.",
  provider: {
    "@type": "Organization",
    name: "Jade Hospitainment",
    url: "https://jadehospitainment.com",
  },
  areaServed: { "@type": "Place", name: "Bangalore, India" },
};

export default function WeekendGetawaysLayout({
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
