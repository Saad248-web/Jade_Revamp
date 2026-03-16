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
import { Info, Calendar } from "lucide-react";

const caravanSlides = [
  {
    title: "Private Lounge",
    desc: "A spacious lounge area designed for relaxing, dining, and spending time together while on the move.",
    image: "/assets/caravan_journey.png", // Using available assets fitting the caravan theme
  },
  {
    title: "Convertible Sleeping Spaces",
    desc: "Flexible sleeping arrangements that comfortably accommodate small groups and families.",
    image: "/assets/private_stay.png",
  },
  {
    title: "Entertainment System",
    desc: "Dual screens, music system, and plug-and-play connectivity for entertainment during the journey.",
    image: "/assets/music_exp.png",
  },
];

const animatedSlides: ScrollSlide[] = [
  {
    label: "A PRIVATE RETREAT ON WHEELS",
    lines: [
      "Rathaa is a fully equipped luxury",
      "caravan designed for small-group",
      "journeys. Combining the comfort of",
      "a private stay with the freedom of",
      "road travel, it allows you to explore",
      "scenic destinations, celebrate",
      "special moments, or simply travel",
      "differently. From short day escapes",
      "to overnight and multi-day journeys,",
      "every experience is curated around",
      "your route, your group, and your pace.",
    ],
  },
];

export default function CaravansPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/assets/caravan_journey.png"
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

      <Footer />
    </main>
  );
}
