"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Calendar, Download, ArrowRight } from "lucide-react";
import { useScroll, useTransform } from "framer-motion";
import FormatsCarousel from "@/components/FormatsCarousel";
import LiveBackground from "@/components/LiveBackground";
import CorporateVillasCarousel from "@/components/CorporateVillasCarousel";
import { VILLAS } from "@/lib/mockData";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import TrustedBySection from "@/components/TrustedBySection";
import ExperienceScrollSection from "@/components/ExperienceScrollSection";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import { useAnimation } from "@/context/AnimationContext";
import { EXPERIENCE_PAGE_PATHS } from "@/lib/enquiryReturnPath";

export default function CorporateRetreatsPage() {
  const { setEnquireOverlayOpen } = useAnimation();

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-16 lg:pb-0">
      <Navbar />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        scrollTargetId="corporate-philosophy"
        backgroundImage="/Experiences/Corporate Retreats/1-Hero/xhero.webp"
        backgroundAlt="Corporate Retreats"
        heading={
          <>
            Corporate Offsites
            <br />
            at Jade
          </>
        }
        description="Private venues designed for focused sessions, team alignment, and meaningful downtime."
        stats={[
          { value: "16", label: "LUXURY VILLA" },
          { value: "7500+", label: "CHECK-INS" },
          { value: "100+", label: "EVENTS HOSTED" },
        ]}
        buttons={[
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "VENUES",
            onClick: () => {
              const venuesSection = document.getElementById("featured-venues");
              if (venuesSection)
                venuesSection.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: <Download className="w-5 h-5" />,
            label: "BROCHURE",
            onClick: () => window.open("/All Properties - Jade Hospitainment.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: TRUSTED BY SECTION */}
      <TrustedBySection />
      {/* SECTION 3: ANIMATED TEXT SECTION */}
      <section className="jade-section bg-[#1A1C1E] border-t border-white/5">
        <ExperienceScrollSection variant="corporate" id="corporate-philosophy" />
      </section>

      {/* SECTION 4: Formats — 85dvh mobile (above bottom nav); 100dvh desktop/laptop */}
      <section className="flex flex-col h-[85dvh] min-h-[85dvh] max-h-[85dvh] overflow-hidden bg-[#1A1C1E] border-t border-white/5 lg:h-[100dvh] lg:min-h-[100dvh] lg:max-h-[100dvh]">
        <FormatsCarousel />
      </section>

      {/* SECTION 5: WHY CHOOSE JADE */}
      <PremiumFeaturesSection
        subheading="WHY CORPORATES CHOOSE JADE"
        heading={
          <>
            Designed for Structured
            <br />
            Corporate Retreats
          </>
        }
        cardsLayout="scroll"
        cards={[
          {
            tag: "provide",
            title: "COMPLETE PRIVACY",
            desc: "Exclusive-use venues with no shared spaces, ensuring uninterrupted sessions and confidential discussions.",
          },
          {
            tag: "enable",
            title: "STRUCTURED PRODUCTIVITY",
            desc: "Flexible indoor and outdoor layouts suited for meetings, workshops, conferences, and recognition programmes.",
          },
          {
            tag: "customise",
            title: "AROUND YOUR TEAM",
            desc: "Tailored meals and curated team-building activities aligned with your retreat goals and schedule.",
          },
          {
            tag: "manage",
            title: "END-TO-END EXECUTION",
            desc: "Clear planning and on-ground coordination to ensure every offsite runs smoothly from start to finish.",
          },
        ]}
        footerText='"Structured spaces and curated experiences brought together under one standard of corporate hospitality."'
        ctaText="SPEAK WITH OUR TEAM"
        onCtaClick={() =>
          setEnquireOverlayOpen(true, EXPERIENCE_PAGE_PATHS.corporateRetreats)
        }
        alternateGold={true}
      />
      {/* SECTION 6: SELECTED VILLAS FOR CORPORET RETREATS */}
      <section className="jade-section bg-[#1A1C1E] border-t border-white/5">
        <div className="text-center mb-12 px-8">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-3 font-manrope">
            FEATURED VENUES
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white mb-6">
            Explore Our Private
            <br />
            Corporate Retreats
          </h2>
        </div>

        <CorporateVillasCarousel />
      </section>
      <Footer />
    </main>
  );
}
