"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./Navbar";
import UnifiedScrollSection from "./UnifiedScrollSection";
import MobileBottomNav from "./MobileBottomNav";
import HorizontalScrollSection from "./HorizontalScrollSection";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import InstagramCarousel from "./InstagramCarousel";
import ValuePropositionSection from "./ValuePropositionSection";
import FeaturedVillas from "./FeaturedVillas";
import JadeAmenitiesSection from "./JadeAmenitiesSection";
import BlogSection from "./BlogSection";
import Footer from "./Footer";

export default function LandingPage() {
  const { isSplashComplete } = useAnimation();
  const containerRef = useRef(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force scroll to top on refresh
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    return () => {
      if (history.scrollRestoration) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

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
      <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <NavbarThemeTrigger theme="white" sectionRef={heroRef} />
        {/* Background Layer */}
        <motion.div
          style={{ y: yBackground }}
          className="absolute inset-0 w-full h-[120%] z-0" // Taller for parallax room
        >
          <Image
            src="/assets/desktop-bg.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>

        {/* Text Content Layer */}
        <motion.div
          // Parallax: Text should move slightly slower than scroll to "remain" longer
          // Previous was 20%, increasing to 30% to be slightly more sticky without exiting bottom
          style={{ y: useTransform(scrollY, [0, 500], ["0%", "30%"]) }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 md:px-12 max-w-[1920px] mx-auto pt-20"
        >
          <div className="max-w-5xl flex flex-col items-center">
            {/* Label - Bolder (font-extra-bold potentially if font-bold isn't enough? 'font-bold' is standard 700. 'font-extrabold' is 800. Trying ext-bold if available or keeping bold.) */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xs md:text-sm tracking-[0.3em] text-jade-gold uppercase mb-6 font-manrope font-bold"
            >
              JADE HOSPITAINMENT
            </motion.p>

            {/* Title - Smaller Size, Forced 2 Lines */}
            <motion.h1
              className="font-philosopher text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-white space-y-2 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="block">Where Hospitality</div>
              <div className="block">Meets Entertainment</div>
            </motion.h1>

            {/* Subtext - Color #FAFAFA, Font Light */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-sm md:text-lg font-light text-[#FAFAFA] max-w-xl font-manrope leading-loose mb-12"
            >
              Private themed farmhouse villas in serene locations of Bangalore,
              curated for gatherings and getaways.
            </motion.p>

            {/* "SCROLL TO EXPERIENCE" - Interactive */}
            <motion.button
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              initial={{ opacity: 0, y: 20 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-[10px] tracking-[0.2em] font-manrope text-white/60 uppercase">
                Scroll to Experience
              </span>
              {/* Vertical Line */}
              <div className="h-16 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <UnifiedScrollSection />
      <MobileBottomNav />
      <HorizontalScrollSection />
      <InstagramCarousel />
      <ValuePropositionSection />
      <FeaturedVillas />
      <JadeAmenitiesSection />
      <BlogSection />
      <Footer />
    </motion.div>
  );
}
