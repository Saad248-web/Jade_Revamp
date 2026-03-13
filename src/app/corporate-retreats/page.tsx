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
import { VILLAS } from "@/data/villas";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";

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
        backgroundImage="/assets/corporate_retreat.png"
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
            icon: <Calendar className="w-4 h-4" />,
            label: "VENUES",
            onClick: () => {
              const venuesSection = document.getElementById("featured-venues");
              if (venuesSection)
                venuesSection.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: <Download className="w-4 h-4" />,
            label: "BROCHURE",
            onClick: () => window.open("/brochure.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: py-12 (48px) for tighter flow */}
      <section className="py-12 bg-[#1A1C1E]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-4">
            TRUSTED BY
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white mb-16">
            World-Class Organizations
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-px bg-white/10">
            {/* Logo 1: Google */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Google
              </span>
            </div>
            {/* Logo 2: Microsoft */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Microsoft
              </span>
            </div>
            {/* Logo 3: L&T */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-manrope text-gh-h3 font-bold italic">
                  L&T
                </span>
              </div>
            </div>
            {/* Logo 4: IBM */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-mono text-gh-h2 font-bold tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                IBM
              </span>
            </div>
            {/* Logo 5: Capgemini */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Capgemini
              </span>
            </div>
            {/* Logo 6: Mercedes-Benz */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
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
      <section className="py-24 bg-[#1A1C1E]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-4 font-manrope">
              WHY CORPORATES CHOOSE JADE
            </p>
            <h2 className="text-gh-h1 font-philosopher text-white mb-8">
              Designed for Structured
              <br />
              Corporate Retreats
            </h2>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide gap-8 mb-20 pb-4 snap-x snap-mandatory">
            {[
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
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[28vw] bg-[#121417] border border-white/[0.05] p-10 md:p-12 flex flex-col justify-between min-h-[450px] lg:min-h-[580px] overflow-hidden transition-all duration-500 hover:border-[#EFCD62]/30 snap-center"
              >
                {/* Saturated Linear Gradient Layer */}
                <div
                  className={`absolute inset-0 bg-gradient-to-${
                    idx % 2 === 0 ? "br" : "tl"
                  } from-[#EFCD62]/15 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                  >
                    <filter id="noise">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                      />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <span className="text-white/40 font-philosopher italic text-gh-body mb-8 block tracking-wide">
                    {card.tag}
                  </span>
                  <h3 className="text-gh-h1 font-manrope font-bold text-white leading-[1.1] tracking-tight uppercase">
                    {card.title.split(" ").map((word, i) => (
                      <React.Fragment key={i}>
                        {word}
                        <br />
                      </React.Fragment>
                    ))}
                  </h3>
                </div>

                <p className="relative z-10 text-white/40 font-manrope text-gh-body leading-relaxed max-w-[95%]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-12">
            <p className="text-white/60 font-philosopher italic text-gh-h3 text-center max-w-3xl leading-relaxed">
              "Structured spaces and curated experiences brought together under
              one standard of corporate hospitality."
            </p>

            <button className="group bg-[#EFCD62] text-black font-manrope font-bold py-5 px-12 flex items-center justify-center gap-4 hover:bg-[#dfbd52] transition-all duration-300 uppercase tracking-widest text-gh-label">
              SPEAK WITH OUR TEAM
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
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
