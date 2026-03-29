// Route-segment layout — Server Component exports metadata for this client-component page
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Party Villas",
  description:
    "Host unforgettable birthday parties, pool parties, bachelor/bachelorette events, and milestone celebrations at exclusive Jade private villas near Bangalore.",
  alternates: { canonical: "https://jadehospitainment.com/party-villas" },
  openGraph: {
    title: "Party Villas | Jade Hospitainment",
    description:
      "Exclusive Jade villas for birthdays, pool parties, bachelor celebrations, and reunions near Bangalore. Private. Curated. Unforgettable.",
    url: "https://jadehospitainment.com/party-villas",
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
      name: "Party Villas",
      item: "https://jadehospitainment.com/party-villas",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Party Villas — Jade Hospitainment",
  description:
    "Private villa spaces near Bangalore for birthdays, pool parties, bachelor events, and curated celebrations.",
  provider: {
    "@type": "Organization",
    name: "Jade Hospitainment",
    url: "https://jadehospitainment.com",
  },
  areaServed: { "@type": "Place", name: "Bangalore, India" },
};

export default function PartyVillasLayout({
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
