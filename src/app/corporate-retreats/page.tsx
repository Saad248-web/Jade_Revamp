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
import VillaCard from "@/components/VillaCard";
import { VILLAS } from "@/data/villas";
import Footer from "@/components/Footer";

export default function CorporateRetreatsPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/corporate_retreat.png"
            alt="Corporate Retreats"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content - Tightened pt-16 (64px) */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-4xl mx-auto pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 relative w-32 md:w-40"
          >
            {/* Jade White Logo */}
            <div className="relative aspect-[3/1] w-full">
              <Image
                src="/assets/White_Logo.png"
                alt="Jade Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-philosopher text-white mb-6 leading-tight">
            Corporate Offsites
            <br />
            at Jade
          </h1>

          <p className="text-white/80 font-manrope text-base md:text-lg max-w-2xl leading-relaxed mb-12">
            Private venues designed for focused sessions, team alignment, and
            meaningful downtime.
          </p>

          {/* Stats: gap-8 (32px) and gap-16 (64px) align with 8pt grid */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 w-full max-w-3xl border border-white/10 bg-black/40 backdrop-blur-md rounded-none p-8 md:p-12 mb-16">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-4xl font-philosopher text-white">
                16
              </span>
              <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest text-center">
                LUXURY VILLA
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-r border-white/10 px-4">
              <span className="text-2xl md:text-4xl font-philosopher text-white">
                7500+
              </span>
              <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest text-center">
                CHECK-INS
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-4xl font-philosopher text-white">
                100+
              </span>
              <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest text-center">
                EVENTS HOSTED
              </span>
            </div>
          </div>

          {/* Actions: gap-4 (16px) aligns with 8pt grid */}
          <div className="flex flex-row gap-4 w-full max-w-2xl">
            <button className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors py-4 px-4 md:px-8 uppercase tracking-widest text-[10px] md:text-xs font-bold flex items-center justify-center gap-2 md:gap-4">
              <Calendar className="w-4 h-4" /> VENUES
            </button>
            <button className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors py-4 px-4 md:px-8 uppercase tracking-widest text-[10px] md:text-xs font-bold flex items-center justify-center gap-2 md:gap-4">
              <Download className="w-4 h-4" /> BROCHURE
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: py-12 (48px) for tighter flow */}
      <section className="py-12 bg-[#1A1C1E]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-[#EFCD62] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4">
            TRUSTED BY
          </p>
          <h2 className="text-3xl md:text-5xl font-philosopher text-white mb-16">
            World-Class Organizations
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-px bg-white/10">
            {/* Logo 1: Google */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-manrope text-2xl font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Google
              </span>
            </div>
            {/* Logo 2: Microsoft */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-manrope text-2xl font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Microsoft
              </span>
            </div>
            {/* Logo 3: L&T */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-manrope text-xl font-bold italic">
                  L&T
                </span>
              </div>
            </div>
            {/* Logo 4: IBM */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-mono text-4xl font-bold tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                IBM
              </span>
            </div>
            {/* Logo 5: Capgemini */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-manrope text-2xl font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Capgemini
              </span>
            </div>
            {/* Logo 6: Mercedes-Benz */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group">
              <span className="text-white font-philosopher text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                Mercedes-Benz
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 3: ANIMATED TEXT SECTION */}
      <AnimatedTextSection />

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
            <p className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4 font-manrope">
              WHY CORPORATES CHOOSE JADE
            </p>
            <h2 className="text-4xl md:text-6xl font-philosopher text-white mb-8">
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
                  <span className="text-white/40 font-philosopher italic text-base md:text-lg mb-8 block tracking-wide">
                    {card.tag}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-manrope font-bold text-white leading-[1.1] tracking-tight uppercase">
                    {card.title.split(" ").map((word, i) => (
                      <React.Fragment key={i}>
                        {word}
                        <br />
                      </React.Fragment>
                    ))}
                  </h3>
                </div>

                <p className="relative z-10 text-white/40 font-manrope text-sm md:text-base leading-relaxed max-w-[95%]">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-12">
            <p className="text-white/60 font-philosopher italic text-xl md:text-2xl text-center max-w-3xl leading-relaxed">
              "Structured spaces and curated experiences brought together under
              one standard of corporate hospitality."
            </p>

            <button className="group bg-[#EFCD62] text-black font-manrope font-bold py-5 px-12 flex items-center justify-center gap-4 hover:bg-[#dfbd52] transition-all duration-300 uppercase tracking-widest text-xs">
              SPEAK WITH OUR TEAM
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
      {/* SECTION 6: SELECTED VILLAS FOR CORPORET RETREATS */}
      <section className="py-24 bg-[#1A1C1E] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4 font-manrope">
              FEATURED VENUES
            </p>
            <h2 className="text-4xl md:text-6xl font-philosopher text-white mb-8">
              Explore Our Private
              <br />
              Corporate Retreats
            </h2>
          </div>

          <div className="flex flex-col">
            {[
              "dome-villas",
              "magnolia",
              "diamond",
              "retreat-on-the-ridge",
              "the-haven",
            ].map((id, index, array) => {
              const villa = VILLAS.find((v) => v.id === id);
              if (!villa) return null;
              return (
                <div key={villa.id}>
                  <VillaCard villa={villa} />
                  {index < array.length - 1 && (
                    <hr className="border-0 border-t border-white/10 my-12" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function AnimatedTextSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lines = [
    "At Jade Hospitainment, corporate",
    "retreats are thoughtfully designed to",
    "balance productivity and relaxation.",
    "From strategic planning sessions and",
    "workshops to recognition nights and",
    "team celebrations, each gathering is",
    "structured around your objectives.",
  ];

  // Locking Logic and holding: match Unified Section feel
  const fadeOutStart = 0.8;
  const sectionY = useTransform(
    scrollYProgress,
    [0, fadeOutStart, 1],
    [0, 0, -50],
  );

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <LiveBackground />

        <motion.div
          style={{ y: sectionY }}
          className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-16 md:pt-24"
        >
          <h2 className="font-manrope font-light text-base md:text-3xl lg:text-5xl leading-[1.8] md:leading-[1.6] text-white/90 flex flex-col items-center">
            {lines.map((line, idx) => {
              const start = idx * 0.08;
              const end = start + 0.12;
              const opacity = useTransform(
                scrollYProgress,
                [start, end, fadeOutStart, 1],
                [0, 1, 1, 0],
              );

              return (
                <motion.span
                  key={idx}
                  style={{ opacity }}
                  className="block text-center"
                >
                  {line}
                </motion.span>
              );
            })}
          </h2>

          {/* Animated Vertical Line Indicator - Lengthened to 200px */}
          <motion.div
            style={{
              height: useTransform(scrollYProgress, [0.7, 0.9], [0, 200]),
              opacity: useTransform(scrollYProgress, [0.7, 0.8], [0, 1]),
            }}
            className="w-px bg-white/20 mt-16 md:mt-24 mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
