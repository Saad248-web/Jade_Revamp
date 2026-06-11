"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Navbar from "@/components/Navbar";
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
import ExperienceScrollSection from "@/components/ExperienceScrollSection";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";
import CuratedExperiencesGrid from "@/components/CuratedExperiencesGrid";
import { useAnimation } from "@/context/AnimationContext";
import { EXPERIENCE_PAGE_PATHS } from "@/lib/enquiryReturnPath";
import { scrollToExperienceVillaSection } from "@/lib/experiencePageVillaScroll";

const partySlides = [
  {
    title: "Pool Parties",
    desc: "Celebrate poolside with loungers, BBQ setups, cocktail stations, and vibrant lighting.",
    image: "/Experiences/Party Villas/2-Party Type/Pool Parties.webp",
  },
  {
    title: "Bachelor/Bachelorette Parties",
    desc: "Private villas designed for pre-wedding celebrations with music, entertainment, and curated dining.",
    image:
      "/Experiences/Party Villas/2-Party Type/Bachelor_Bachelorette Parties.webp",
  },
  {
    title: "Reunions & Graduation Parties",
    desc: "Spacious villas perfect for reconnecting, celebrating milestones, and hosting memorable gatherings.",
    image:
      "/Experiences/Party Villas/2-Party Type/Reunions & Graduation Parties.webp",
  },
  {
    title: "Birthdays & Anniversaries",
    desc: "Host memorable celebrations in beautifully curated villas with décor, dining, music, and private pools.",
    image:
      "/Experiences/Party Villas/2-Party Type/Birthdays & Anniversaries.webp",
  },
];

export default function PartyVillasPage() {
  const { setEnquireOverlayOpen } = useAnimation();

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <Navbar />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        scrollTargetId="party-philosophy"
        backgroundImage="/Experiences/Party Villas/1-Hero/Pool Parties.webp"
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
            onClick: () => scrollToExperienceVillaSection("party"),
          },
          {
            icon: <Download className="w-5 h-5" />,
            label: "BROCHURE",
            onClick: () => window.open("/brochure.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <ExperienceScrollSection variant="party" id="party-philosophy" />

      {/* SECTION 3: PARTY TYPES CAROUSEL */}
      <ExperienceCarouselSection
        label="WHAT WE OFFER"
        title="Party Types"
        slides={partySlides}
        ctaText="BOOK A PARTY VILLA"
        onCtaClick={() =>
          setEnquireOverlayOpen(true, EXPERIENCE_PAGE_PATHS.partyVillas)
        }
      />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <CuratedExperiencesGrid
        label="PERSONALIZE YOUR CELEBRATION"
        title="Curated Experiences"
        showCta={false}
        innerClassName="max-w-6xl mx-auto px-4 sm:px-6 md:px-8"
        experiences={[
          {
            title: "DJ & Music Setup",
            image: "/Experiences/Party Villas/3-Addons/DJ & Music Setup.webp",
          },
          {
            title: "BBQ & Live Grills",
            image: "/Experiences/Party Villas/3-Addons/BBQ & Live Grills.webp",
          },
          {
            title: "Cocktail Bar Setup",
            image: "/Experiences/Party Villas/3-Addons/Cocktail Bar Setup.webp",
          },
          {
            title: "Bonfire Nights",
            image: "/Experiences/Party Villas/3-Addons/Bonfire Nights.webp",
          },
          {
            title: "Movie Under the Stars",
            image:
              "/Experiences/Party Villas/3-Addons/Movie Under The Stars-2.webp",
          },
          {
            title: "Themed Decor & Styling",
            image:
              "/Experiences/Party Villas/3-Addons/Themed Decor and Styling.webp",
          },
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
      cardsLayout="scroll"
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
      onCtaClick={() =>
        setEnquireOverlayOpen(true, EXPERIENCE_PAGE_PATHS.partyVillas)
      }
      alternateGold={true}
      experienceCta
    />
  );
}
