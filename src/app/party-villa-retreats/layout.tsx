// Route-segment layout — Server Component exports metadata for this client-component page
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Party Villa Retreats",
  description:
    "Host unforgettable birthday parties, pool parties, bachelor/bachelorette events, and milestone celebrations at exclusive Jade Private Villa Retreats near Bangalore.",
  alternates: { canonical: "https://jadehospitainment.com/party-villa-retreats" },
  openGraph: {
    title: "Party Villa Retreats | Jade Hospitainment",
    description:
      "Exclusive Jade villa retreats for birthdays, pool parties, bachelor celebrations, and reunions near Bangalore. Private. Curated. Unforgettable.",
    url: "https://jadehospitainment.com/party-villa-retreats",
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
      name: "Party Villa Retreats",
      item: "https://jadehospitainment.com/party-villa-retreats",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Party Villa Retreats — Jade Hospitainment",
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
