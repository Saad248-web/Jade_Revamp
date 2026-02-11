"use client";

import { useRef } from "react";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./Navbar";
import HospitainmentDefinition from "./HospitainmentDefinition";
import VillaRetreats from "./VillaRetreats";
import ExperiencesSection from "./ExperiencesSection";
import HorizontalScrollSection from "./HorizontalScrollSection";

export default function LandingPage() {
  const { isSplashComplete } = useAnimation();
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], ["0%", "40%"]); // Background moves slower (Parallax)
  const yText = useTransform(scrollY, [0, 500], ["0%", "100%"]); // Text moves faster/away

  // Text Reveal Variants
  const revealContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const revealLine = {
    hidden: { y: "100%" },
    visible: {
      y: "0%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 1.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-[300vh] bg-jade-dark text-white" // Extended height for scroll testing
      initial={{ opacity: 0 }}
      animate={{ opacity: isSplashComplete ? 1 : 0 }}
      transition={{ duration: 0.1 }} // Instant appear, relying on splash seamlessness
    >
      {/* 1. Navigation & Header */}
      <Navbar />

      {/* Fixed Header Elements (Logo & Contact) */}

      {/* 2. Hero Section (Parallax) */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Layer */}
        <motion.div
          style={{ y: yBackground }}
          className="absolute inset-0 w-full h-[120%] z-0" // Taller for parallax room
        >
          <Image
            src="/assets/desktop-bg.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            style={{ objectPosition: "center" }}
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>

        {/* Text Content Layer */}
        <motion.div
          style={{ y: yText }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 md:px-12 max-w-[1920px] mx-auto pt-32" // Added pt-32 to push it slightly "below mid" visually if needed, or just center.
        >
          <div className="max-w-5xl flex flex-col items-center">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xs md:text-sm tracking-[0.3em] text-jade-gold uppercase mb-6 font-manrope"
            >
              Jade Hospitainment
            </motion.p>

            {/* Cinematic Heading (Line Mask Reveal) */}
            <motion.h1
              className="font-philosopher text-5xl md:text-7xl lg:text-9xl leading-[0.9] text-white space-y-2 mb-8"
              variants={revealContainer}
              initial="hidden"
              animate={isSplashComplete ? "visible" : "hidden"}
            >
              <div className="overflow-hidden">
                <motion.div variants={revealLine}>Where Hospitality</motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div variants={revealLine}>
                  Meets Entertainment
                </motion.div>
              </div>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate={isSplashComplete ? "visible" : "hidden"}
              className="text-base md:text-xl font-light text-white/80 max-w-2xl font-manrope leading-relaxed"
            >
              Private themed farmhouse villas in serene locations of Bangalore,
              curated for gatherings and getaways.
            </motion.p>

            {/* Vertical Line */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={isSplashComplete ? { height: 80, opacity: 1 } : {}} // Height 80px
              transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
              className="w-[1px] bg-gradient-to-b from-white/50 to-transparent mt-12"
            />
          </div>
        </motion.div>
      </div>

      <HospitainmentDefinition />
      <VillaRetreats />
      <ExperiencesSection />
      <HorizontalScrollSection />

      {/* 3. Content Placeholders (Scroll Testing) */}
      <section className="relative z-20 bg-jade-charcoal py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-philosopher text-jade-gold">
              The Experience
            </h2>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Every detail is meticulously crafted to ensure your stay is
              efficient, seamless, and unforgettable.
            </p>
          </div>
          <div className="h-[600px] w-full bg-white/5 rounded-lg border border-white/10 relative overflow-hidden group">
            <Image
              src="/assets/splash-bg.png"
              alt="Experience"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-jade-charcoal py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl text-white/40 uppercase tracking-widest font-manrope mb-12">
            Our Collections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-white/5 relative border border-white/10 hover:border-jade-gold/50 transition-colors duration-500 cursor-pointer"
              >
                <div className="absolute bottom-8 left-8">
                  <span className="text-xs text-jade-gold uppercase tracking-widest block mb-2">
                    Collection 0{i}
                  </span>
                  <span className="text-2xl font-philosopher text-white">
                    Villa Serenity
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
