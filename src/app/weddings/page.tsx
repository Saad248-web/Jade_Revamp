import type { Metadata } from "next";
import WeddingHero from "@/components/WeddingHero";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/seo/JsonLd";
import dynamic from "next/dynamic";

const WeddingScrollSection = dynamic(
  () => import("@/components/WeddingScrollSection"),
  { ssr: false },
);
const WeddingVillasCarousel = dynamic(
  () => import("@/components/WeddingVillasCarousel"),
  { ssr: false },
);
const WeddingServicesSection = dynamic(
  () => import("@/components/WeddingServicesSection"),
  { ssr: false },
);
const WhyJadeWeddings = dynamic(() => import("@/components/WhyJadeWeddings"), {
  ssr: false,
});
const WeddingCelebrationsSection = dynamic(
  () => import("@/components/WeddingCelebrationsSection"),
  { ssr: false },
);

export const metadata: Metadata = {
  title: "Destination Weddings",
  description:
    "Host your dream wedding at Jade Hospitainment's boutique private estates near Bangalore — farmhouse gardens, private pools, and bespoke ceremonial experiences.",
  alternates: { canonical: "https://jadehospitainment.com/weddings" },
  openGraph: {
    title: "Destination Weddings | Jade Hospitainment",
    description:
      "Bespoke Garden & Farmhouse Weddings near Bangalore. Private estates. Intimate ceremonies. Unforgettable celebrations.",
    url: "https://jadehospitainment.com/weddings",
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
      name: "Weddings",
      item: "https://jadehospitainment.com/weddings",
    },
  ],
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Destination Weddings at Jade Hospitainment",
  description:
    "Bespoke destination wedding experiences at exclusive private estates near Bangalore.",
  location: {
    "@type": "Place",
    name: "Jade Hospitainment Private Estates",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressCountry: "IN",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Jade Hospitainment",
    url: "https://jadehospitainment.com",
  },
};

export default function WeddingPage() {
  return (
    <SmoothScroll>
      <main className="relative bg-[#1A1C1E] min-h-screen">
        <JsonLd schema={breadcrumbSchema} />
        <JsonLd schema={eventSchema} />
        <Navbar />

        <WeddingHero />

        <div className="relative z-10">
          <WeddingScrollSection />
          <WeddingVillasCarousel />
          <WeddingServicesSection />
          <WhyJadeWeddings />
          <WeddingCelebrationsSection />
        </div>

        <Footer />
        <MobileBottomNav />
      </main>
    </SmoothScroll>
  );
}
