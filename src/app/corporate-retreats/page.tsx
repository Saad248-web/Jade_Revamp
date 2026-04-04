"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CorporateHeader from "@/components/CorporateHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Calendar, Download, ArrowRight } from "lucide-react";
import { useScroll, useTransform } from "framer-motion";
import FormatsCarousel from "@/components/FormatsCarousel";
import LiveBackground from "@/components/LiveBackground";
import CorporateVillasCarousel from "@/components/CorporateVillasCarousel";
import { VILLAS } from "@/lib/mockData";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";

const animatedSlides: ScrollSlide[] = [
  {
    lines: [
      "At Jade Hospitainment, corporate",
      "retreats are thoughtfully designed to",
      "balance productivity and relaxation.",
      "From strategic planning sessions and",
      "workshops to recognition nights and",
      "team celebrations, each gathering is",
      "structured around your objectives.",
    ],
  },
];

export default function CorporateRetreatsPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/X/ROR/15.webp"
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
            onClick: () => window.open("/brochure.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: TRUSTED BY SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 bg-[#1A1C1E]">
        <div className="max-w-4xl mx-auto px-8 text-center w-full">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-4">
            TRUSTED BY
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white mb-20 leading-tight">
            World-Class <br /> Organizations
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Logo 1: Google */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Google
              </span>
            </div>
            {/* Logo 2: Microsoft */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Microsoft
              </span>
            </div>
            {/* Logo 3: L&T */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-manrope text-gh-h3 font-bold italic">
                  L&T
                </span>
              </div>
            </div>
            {/* Logo 4: IBM */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-mono text-gh-h2 font-bold tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                IBM
              </span>
            </div>
            {/* Logo 5: Capgemini */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Capgemini
              </span>
            </div>
            {/* Logo 6: Mercedes-Benz */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-philosopher text-gh-h3 opacity-60 group-hover:opacity-100 transition-opacity">
                Mercedes-Benz
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 3: ANIMATED TEXT SECTION */}
      <ScrollSectionComposer slides={animatedSlides} height="250vh" />

      {/* SECTION 4: py-12 (48px) for tighter flow */}
      <section className="py-12 bg-[#1A1C1E] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <FormatsCarousel />
        </div>
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
        ctaLink="/contact"
      />
      {/* SECTION 6: SELECTED VILLAS FOR CORPORET RETREATS */}
      <section className="py-24 bg-[#1A1C1E] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-8">
            <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-4 font-manrope">
              FEATURED VENUES
            </p>
            <h2 className="text-gh-h1 font-philosopher text-white mb-8">
              Explore Our Private
              <br />
              Corporate Retreats
            </h2>
          </div>

          <CorporateVillasCarousel />
        </div>
      </section>
      <Footer />
    </main>
  );
}
