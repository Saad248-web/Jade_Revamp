import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ExperiencesHero from "@/components/ExperiencesHero";
import MobileBottomNav from "@/components/MobileBottomNav";
import JsonLd from "@/components/seo/JsonLd";
import dynamic from "next/dynamic";

const ExperiencesScrollSection = dynamic(
  () => import("@/components/ExperiencesScrollSection"),
  { ssr: false },
);
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export const metadata: Metadata = {
  title: "Curated Experiences",
  description:
    "Discover curated luxury experiences near Bangalore — from poolside getaways and bonfire nights to private dining and wellness retreats at Jade Hospitainment.",
  alternates: { canonical: "https://jadehospitainment.com/experiences" },
  openGraph: {
    title: "Curated Experiences | Jade Hospitainment",
    description:
      "Curated luxury experiences: poolside mornings, bonfire nights, outdoor dining, and more at exclusive Jade Private Villa Retreats.",
    url: "https://jadehospitainment.com/experiences",
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
      name: "Experiences",
      item: "https://jadehospitainment.com/experiences",
    },
  ],
};

const tripSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "Curated Luxury Experiences by Jade Hospitainment",
  description:
    "Bespoke curated experiences — poolside retreats, bonfire nights, private dining, and wellness — at exclusive villa retreats near Bangalore.",
  provider: {
    "@type": "Organization",
    name: "Jade Hospitainment",
    url: "https://jadehospitainment.com",
  },
};

export default function ExperiencesPage() {
  return (
    <main className="bg-[#1A1C1E] min-h-screen">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={tripSchema} />
      <Navbar />
      <ExperiencesHero />
      {/* Start of Content Sections - Reusing existing sections or placeholders for now */}
      <div id="experiences-list">
        <ExperiencesScrollSection />
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
