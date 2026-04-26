"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import CorporateHeader from "@/components/CorporateHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import PrimaryButton from "@/components/PrimaryButton";
import {
  Home,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Users,
  Wifi,
  Coffee,
  Heart,
  Music,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import LiveBackground from "@/components/LiveBackground";
import Footer from "@/components/Footer";
import PartyVillasCarousel from "@/components/PartyVillasCarousel";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";
import CuratedExperiencesGrid from "@/components/CuratedExperiencesGrid";
import { useAnimation } from "@/context/AnimationContext";

const partySlides = [
  {
    title: "Pool Parties",
    desc: "Celebrate poolside with loungers, BBQ setups, cocktail stations, and vibrant lighting.",
    image: "/Villa_Retreats/Dome/Perfect For/Pool Parties.webp",
  },
  {
    title: "Bachelor/Bachelorette Parties",
    desc: "Private villas designed for pre-wedding celebrations with music, entertainment, and curated dining.",
    image: "/Villa_Retreats/Magnolia/Spaces/Pool.webp",
  },
  {
    title: "Reunions & Graduation Parties",
    desc: "Spacious villas perfect for reconnecting, celebrating milestones, and hosting memorable gatherings.",
    image: "/Villa_Retreats/Retreat on the ridge/2-Spaces/Poolside Lawn.webp",
  },
  {
    title: "Birthdays & Anniversaries",
    desc: "Host memorable celebrations in beautifully curated villas with décor, dining, music, and private pools.",
    image: "/Villa_Retreats/Haven/Spaces/Pool.webp",
  },
];

const animatedSlides: ScrollSlide[] = [
  {
    label: "CELEBRATIONS, REIMAGINED",
    lines: [
      "Jade's private villas offer the perfect",
      "setting for unforgettable celebrations.",
      "Whether it's a birthday, anniversary,",
      "pool party, or reunion with friends,",
      "each space is designed for private",
      "gatherings with curated setups, great",
      "music, and moments worth celebrating.",
    ],
  },
];

export default function PartyVillasPage() {
  const { setEnquireOverlayOpen } = useAnimation();

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/X/HAVEN/pool new.webp"
        backgroundAlt="Party Villas"
        heading={
          <>
            Celebrate in Style with
            <br />
            Jade Party Villas
          </>
        }
        description="Host birthdays, pool parties, reunions or milestone celebrations in exclusive Jade villas with private pools, curated setups & personalized experiences."
        buttons={[
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "VENUES",
            onClick: () => {
              const venuesSection = document.getElementById(
                "spaces-for-celebrations",
              );
              if (venuesSection)
                venuesSection.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: <Download className="w-5 h-5" />,
            label: "BROCHURE",
            onClick: () => window.open("/brochure.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <ScrollSectionComposer slides={animatedSlides} height="250vh" />

      {/* SECTION 3: PARTY TYPES CAROUSEL */}
      <ExperienceCarouselSection
        label="WHAT WE OFFER"
        title="Party Types"
        slides={partySlides}
        ctaText="BOOK A PARTY VILLA"
        buttonContainerClassName="h-[54px]"
      />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <CuratedExperiencesGrid
        label="PERSONALIZE YOUR CELEBRATION"
        title="Curated Experiences"
        ctaText="PLAN YOUR CELEBRATION"
        onCtaClick={() => setEnquireOverlayOpen(true)}
        experiences={[
          { title: "DJ & Music Setup", image: "/X/HAVEN/meco.webp" },
          { title: "BBQ & Live Grills", image: "/X/Tranquil Woods/9.webp" },
          { title: "Cocktail Bar Setup", image: "/X/HAVEN/pool new.webp" },
          { title: "Bonfire Nights", image: "/X/HAVEN/BONFIRE.webp" },
          {
            title: "Movie Under the Stars",
            image:
              "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_13_Image_0001.webp",
          },
          { title: "Themed Decor & Styling", image: "/X/Magnolia/13.webp" },
        ]}
      />

      {/* SECTION 5: SPACES MADE FOR CELEBRATIONS */}
      <div id="spaces-for-celebrations">
        <SpacesForCelebrationsSection />
      </div>

      {/* SECTION 6: FEATURED PARTY VILLAS */}
      <PartyVillasCarousel />

      <Footer />
    </main>
  );
}

function SpacesForCelebrationsSection() {
  const { setEnquireOverlayOpen } = useAnimation();

  return (
    <PremiumFeaturesSection
      subheading="WHY CELEBRATE AT JADE"
      heading="Spaces Made for Celebrations"
      cards={[
        {
          tag: "enjoy",
          title: "PRIVATE PARTY VILLAS",
          desc: "Exclusive villas with private pools and spacious outdoor areas designed for unforgettable celebrations.",
        },
        {
          tag: "customize",
          title: "YOUR CELEBRATION",
          desc: "Tailor décor, dining, music, and experiences to match your celebration.",
        },
        {
          tag: "experience",
          title: "SEAMLESS SERVICE",
          desc: "Our team handles planning, setup, and coordination so you can focus on celebrating.",
        },
        {
          tag: "enjoy",
          title: "LUXURY AMENITIES",
          desc: "Private pools, entertainment zones, music systems, BBQ setups, and spacious lounges.",
        },
      ]}
      footerText="Private villas and curated experiences designed to make every celebration a masterpiece."
      ctaText="PLAN YOUR CELEBRATION"
      onCtaClick={() => setEnquireOverlayOpen(true)}
      alternateGold={true}
    />
  );
}
