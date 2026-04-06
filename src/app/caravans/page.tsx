"use client";

import React from "react";
import Image from "next/image";
import CorporateHeader from "@/components/CorporateHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";
import CaravanUsageSection from "@/components/CaravanUsageSection";
import CaravanJourneySection from "@/components/CaravanJourneySection";
import CuratedExperiencesGrid from "@/components/CuratedExperiencesGrid";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import TravelGuidelinesSection from "@/components/TravelGuidelinesSection";
import { Info, Calendar } from "lucide-react";
import { useAnimation } from "@/context/AnimationContext";

const caravanSlides = [
  {
    title: "Private Lounge",
    desc: "A spacious lounge area designed for relaxing, dining, and spending time together while on the move.",
    image: "/X/Magnolia/14.webp", // Using available assets fitting the caravan theme
  },
  {
    title: "Convertible Sleeping Spaces",
    desc: "Flexible sleeping arrangements that comfortably accommodate small groups and families.",
    image:
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_05_Image_0003.webp",
  },
  {
    title: "Entertainment System",
    desc: "Dual screens, music system, and plug-and-play connectivity for entertainment during the journey.",
    image: "/X/HAVEN/meco.webp",
  },
  {
    title: "Kitchenette & Refreshments",
    desc: "Refrigerator, water dispenser, and essential utilities to keep you refreshed throughout the trip.",
    image: "/X/Magnolia/18.webp",
  },
  {
    title: "Climate-Controlled Interiors",
    desc: "Fully air-conditioned interiors designed for comfortable travel in all seasons.",
    image: "/X/Magnolia/16.webp",
  },
  {
    title: "Capacity",
    desc: "Ideal for 6–8 guests travelling together.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600",
  },
];

const animatedSlides: ScrollSlide[] = [
  {
    label: "A PRIVATE RETREAT ON WHEELS",
    lines: [
      "Rathaa is a fully equipped luxury caravan designed for small-group journeys.",
      "Combining the comfort of a private stay with the freedom of road travel, it allows you to explore",
      "scenic destinations, celebrate special moments, or simply travel differently.",
      "From short day escapes to overnight and multi-day journeys, every experience is",
      "curated around your route, your group, and your pace.",
    ],
  },
];

export default function CaravansPage() {
  const { setRathaaOverlayOpen } = useAnimation();

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/X/Magnolia/14.webp"
        backgroundAlt="Caravans"
        heading={
          <>
            Rathaa By Jade, A
            <br />
            Retreat on the Move
          </>
        }
        description="A private caravan experience designed for curated road journeys, celebrations, and escapes beyond the city."
        buttons={[
          {
            icon: <Info className="w-5 h-5" />,
            label: "KNOW MORE",
            onClick: () => {
              const carouselSection = document.getElementById("the-caravan");
              if (carouselSection)
                carouselSection.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "PLAN JOURNEY",
            onClick: () => window.open("/contact", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <ScrollSectionComposer slides={animatedSlides} height="300vh" />

      {/* SECTION 3: THE CARAVAN CAROUSEL */}
      <div id="the-caravan">
        <ExperienceCarouselSection
          label="INSIDE THE RATHAA EXPERIENCE"
          title="The Caravan"
          slides={caravanSlides}
          ctaText="BOOK CARAVAN"
          aspectClass="aspect-[343/531]"
          buttonContainerClassName="h-[54px]"
        />
      </div>

      <CaravanUsageSection />
      <CaravanJourneySection />

      <CuratedExperiencesGrid
        label="CURATED EXPERIENCES"
        title="Enhance Your Stay"
        ctaText="ENQUIRE"
        onCtaClick={() => window.open("/contact", "_blank")}
        experiences={[
          { title: "Bonfire Experience", image: "/X/HAVEN/BONFIRE.webp" },
          { title: "BBQ & Outdoor Dining", image: "/X/Tranquil Woods/9.webp" },
          { title: "Camping & Tent Kits", image: "/X/Tranquil Woods/1.webp" },
          { title: "Activity Kits", image: "/X/HAVEN/POOL TABLE1.webp" },
          { title: "Butler Service", image: "/X/HAVEN/dining 1.webp" },
          {
            title: "Custom Celebration Setups",
            image: "/X/HAVEN/pool new.webp",
          },
        ]}
      />

      <PremiumFeaturesSection
        subheading="WHY RATHAA"
        heading="Travel Reimagined"
        cards={[
          {
            tag: "experience",
            title: "PRIVATE JOURNEYS",
            desc: "Travel with your group in a fully private caravan, designed for small gatherings, celebrations, and relaxed escapes.",
          },
          {
            tag: "explore",
            title: "CURATED ROUTES",
            desc: "Discover scenic destinations and offbeat stops through thoughtfully designed travel circuits around and beyond the city.",
          },
          {
            tag: "enjoy",
            title: "COMFORT ON THE ROAD",
            desc: "A fully equipped caravan with lounge seating, sleeping spaces, entertainment, and modern travel amenities.",
          },
          {
            tag: "create",
            title: "CUSTOM JOURNEYS",
            desc: "From one-day escapes to overnight retreats and multi-day road trips, every journey can be tailored to your plan.",
          },
        ]}
        footerText="Rathaa turns every road into an experience for those who travel beyond the ordinary."
        ctaText="PLAN YOUR JOURNEY"
        onCtaClick={() => setRathaaOverlayOpen(true)}
      />

      <TravelGuidelinesSection />

      <Footer />
    </main>
  );
}
