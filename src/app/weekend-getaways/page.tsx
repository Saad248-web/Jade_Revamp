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
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useAnimation } from "@/context/AnimationContext";
import LiveBackground from "@/components/LiveBackground";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";
import VillasCarouselSection from "@/components/VillasCarouselSection";
import CuratedExperiencesGrid from "@/components/CuratedExperiencesGrid";
import WeekendVillasCarousel from "@/components/WeekendVillasCarousel";

// Per request: remove all image links from this page (text-first).

const animatedSlides: ScrollSlide[] = [
  {
    label: "A DIFFERENT KIND OF WEEKEND ESCAPE",
    lines: [
      "Jade’s private villas offer space,",
      "privacy, and comfort just outside the",
      "city. Whether you’re planning a",
      "relaxed stay with friends, a family",
      "getaway, or a small celebration, each",
      "retreat is designed to let you slow",
      "down and enjoy the moment.",
    ],
  },
];

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

const weekendVillas = [
  {
    name: "Dome Villa",
    tag: "HOBBIT-INSPIRED PRIVATE RETREAT",
    image: "/Villa_Retreats/Palatio/1-Hero/Facade_Day.jpg",
  },
  {
    name: "Magnolia",
    tag: "CONTEMPORARY GLASS FARM VILLA",
    image: "/Villa_Retreats/Palatio/3-Experiences/Pool_Breakfast.jpg",
  },
  {
    name: "Haven",
    tag: "BOUTIQUE LUXURY VILLA",
    image: "/Experiences/Weddings/Bachelorette.webp",
  },
  {
    name: "Tranquil Woods",
    tag: "FOREST RETREAT",
    image: "/Villa_Retreats/Palatio/1-Hero/Facade_Day.jpg",
  },
];

export default function WeekendGetawaysPage() {
  const { setEnquireOverlayOpen } = useAnimation();

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/Experiences/Weekend Getaways/1-Hero/casual stays.webp"
        backgroundAlt="Weekend Getaways"
        heading={
          <>
            Weekend Getaways
            <br />
            In Bangalore
          </>
        }
        description="Private villas designed for relaxed escapes, small celebrations, and memorable weekends with friends and family."
        buttons={[
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "VENUES",
            onClick: () => {
              const venuesSection = document.getElementById("themed-villas");
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

      {/* SECTION 3: WEEKEND TYPES CAROUSEL */}
      <ExperienceCarouselSection
        label="WHAT WEEKENDS AT JADE LOOK LIKE"
        title="Jade Weekends"
        slides={weekendSlides}
        ctaText="BOOK JADE WEEKEND"
        onCtaClick={() => setEnquireOverlayOpen(true)}
      />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <CuratedExperiencesGrid
        label="CURATED EXPERIENCES"
        title="Enhance Your Stay"
        experiences={weekendExperiences}
        ctaText="VIEW ALL EXPERIENCES"
        onCtaClick={() => setEnquireOverlayOpen(true)}
        innerClassName="max-w-6xl mx-auto px-4 sm:px-6 md:px-8"
        ctaContainerClassName="w-full max-w-xl mx-auto"
      />

      {/* SECTION 5: WHY CHOOSE JADE */}
      <WhyChooseJadeSection />

      {/* SECTION 6: OUR VILLAS CAROUSEL */}
      <div id="themed-villas">
        <WeekendVillasCarousel />
      </div>

      {/* SECTION 4: CTA */}
      <section className="py-fluid-lg md:py-fluid-xl bg-[#141517] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-6">
            PLAN YOUR WEEKEND
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white mb-6">
            Want a curated weekend escape?
          </h2>
          <p className="text-white/60 font-manrope text-gh-body leading-relaxed mb-10">
            Reach out and we&apos;ll suggest the best villas for your group
            size, occasion, and preferred vibe.
          </p>
          <PrimaryButton
            onClick={() => setEnquireOverlayOpen(true)}
            className="w-full max-w-md mx-auto"
          >
            ENQUIRE
          </PrimaryButton>
        </div>
      </section>

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
          title: "PRIVATE VILLAS",
          desc: "Stay in fully private villas designed for relaxed getaways, with no shared spaces and complete freedom to enjoy your time.",
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
      footerText="Private villas and curated experiences designed to make every weekend feel like an escape."
      ctaText="PLAN YOUR WEEKEND ESCAPE"
      onCtaClick={() => setEnquireOverlayOpen(true)}
      cardClassName="bg-[#363A45]"
      alternateGold={true}
    />
  );
}
