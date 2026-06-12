"use client";

import React from "react";
import { Calendar, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import PrimaryButton from "@/components/PrimaryButton";
import { useAnimation } from "@/context/AnimationContext";
import { EXPERIENCE_PAGE_PATHS } from "@/lib/enquiryReturnPath";
import { scrollToExperienceVillaSection } from "@/lib/experiencePageVillaScroll";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ExperienceScrollSection from "@/components/ExperienceScrollSection";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";
import CuratedExperiencesGrid from "@/components/CuratedExperiencesGrid";
import WeekendThemedVillasSection from "@/components/weekend/WeekendThemedVillasSection";

// Per request: remove all image links from this page (text-first).

const weekendSlides = [
  {
    title: "Poolside Mornings",
    desc: "Slow mornings by the pool with coffee, sunlight, and nowhere else to be.",
    image:
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Poolside Mornings.webp",
  },
  {
    title: "Evenings Under the Stars",
    desc: "Bonfires, music, and long conversations that stretch late into the night.",
    image:
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Evenings Under the Stars.webp",
  },
  {
    title: "Outdoor Dining",
    desc: "Freshly grilled meals, laughter around the table, and food shared with friends.",
    image:
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Outdoor dining.webp",
  },
  {
    title: "Nature & Nearby Escapes",
    desc: "Morning treks, quiet lakes, and scenic walks just minutes from your villa.",
    image:
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Nature & Nearby Escapes.webp",
  },
];

const weekendExperiences = [
  {
    title: "Bonfire Nights",
    image: "/Experiences/Weekend Getaways/3-Addons/Bonfire Nights.webp",
  },
  {
    title: "BBQ Evenings",
    image: "/Experiences/Weekend Getaways/3-Addons/BBQ Evenings.webp",
  },
  {
    title: "Movie Under the Stars",
    image:
      "/Experiences/Weekend Getaways/3-Addons/Movie Under The Stars-2.webp",
  },
  {
    title: "Candlelight Dinner",
    image: "/Experiences/Weekend Getaways/3-Addons/Candlelight Dinner.webp",
  },
  {
    title: "Outdoor Games",
    image: "/Experiences/Weekend Getaways/3-Addons/outdoor games.webp",
  },
  {
    title: "Live Music / DJ",
    image: "/Experiences/Weekend Getaways/3-Addons/Live Music _ DJ.webp",
  },
  {
    title: "Private Chef Experience",
    image:
      "/Experiences/Weekend Getaways/3-Addons/Private Chef Experience.webp",
  },
];

export default function WeekendGetawaysPage() {
  const { setEnquireOverlayOpen } = useAnimation();

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-16 lg:pb-0">
      <Navbar />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        scrollTargetId="weekend-philosophy"
        videoSlug="getaways"
        backgroundImage="/Experiences/Weekend Getaways/1-Hero/casual stays.webp"
        backgroundAlt="Weekend Getaways"
        heading={
          <>
            Weekend Getaways
            <br />
            In Bangalore
          </>
        }
        description="Private Villas designed for relaxed escapes, small celebrations, and memorable weekends with friends and family."
        buttons={[
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "VENUES",
            onClick: () => scrollToExperienceVillaSection("weekend"),
          },
          {
            icon: <Download className="w-5 h-5" />,
            label: "BROCHURE",
            onClick: () => window.open("/All Properties - Jade Hospitainment.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <ExperienceScrollSection variant="weekend" id="weekend-philosophy" />

      {/* SECTION 3: WEEKEND TYPES CAROUSEL */}
      <ExperienceCarouselSection
        label="WHAT WEEKENDS AT JADE LOOK LIKE"
        title="Jade Weekends"
        slides={weekendSlides}
        ctaText="BOOK JADE WEEKEND"
        onCtaClick={() =>
          setEnquireOverlayOpen(true, EXPERIENCE_PAGE_PATHS.weekendGetaways)
        }
      />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <CuratedExperiencesGrid
        label="CURATED EXPERIENCES"
        title="Enhance Your Stay"
        experiences={weekendExperiences}
        showCta={false}
        ctaText="VIEW ALL EXPERIENCES"
        onCtaClick={() =>
          setEnquireOverlayOpen(true, EXPERIENCE_PAGE_PATHS.weekendGetaways)
        }
        innerClassName="max-w-6xl mx-auto px-4 sm:px-6 md:px-8"
      />

      {/* SECTION 5: WHY CHOOSE JADE */}
      <WhyChooseJadeSection />

      {/* SECTION 6: Themed Villas */}
      <WeekendThemedVillasSection />

      <Footer />
    </main>
  );
}

function WhyChooseJadeSection() {
  const { setEnquireOverlayOpen } = useAnimation();

  return (
    <PremiumFeaturesSection
      subheading="WHY CHOOSE JADE"
      heading="Designed for Private Weekend Escapes"
      cardsLayout="scroll"
      cards={[
        {
          tag: "provide",
          title: "Private Villas",
          desc: "Stay in fully Private Villas designed for relaxed getaways, with no shared spaces and complete freedom to enjoy your time.",
        },
        {
          tag: "create",
          title: "ROOM TO UNWIND",
          desc: "Spacious lawns, private pools, and open settings that make it easy to slow down and enjoy the weekend.",
        },
        {
          tag: "customise",
          title: "YOUR EXPERIENCE",
          desc: "Add bonfires, BBQ nights, movie screenings, or curated dining experiences to make your getaway truly memorable.",
        },
        {
          tag: "host",
          title: "SEAMLESS STAYS",
          desc: "From check-in to curated experiences, our team ensures your weekend getaway is effortless and well taken care of.",
        },
      ]}
      footerText="Private Villas and curated experiences designed to make every weekend feel like an escape."
      ctaText="PLAN YOUR WEEKEND ESCAPE"
      onCtaClick={() =>
        setEnquireOverlayOpen(true, EXPERIENCE_PAGE_PATHS.weekendGetaways)
      }
      alternateGold={true}
      experienceCta
    />
  );
}
