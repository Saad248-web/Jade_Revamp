"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import dynamic from "next/dynamic";

const UnifiedScrollSection = dynamic(() => import("./UnifiedScrollSection"), {
  ssr: false,
});
const HorizontalScrollSection = dynamic(
  () => import("./HorizontalScrollSection"),
  { ssr: false },
);
const InstagramCarousel = dynamic(() => import("./InstagramCarousel"), {
  ssr: false,
});
const ValuePropositionSection = dynamic(
  () => import("./ValuePropositionSection"),
  { ssr: false },
);
const FeaturedVillas = dynamic(() => import("./FeaturedVillas"), {
  ssr: false,
});
const JadeAmenitiesSection = dynamic(() => import("./JadeAmenitiesSection"), {
  ssr: false,
});
const BlogSection = dynamic(() => import("./BlogSection"), { ssr: false });
const Footer = dynamic(() => import("./Footer"), { ssr: false });

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

    // Sync scroll after dynamic imports mount
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1000);

    return () => {
      if (history.scrollRestoration) {
        history.scrollRestoration = "auto";
      }
      clearTimeout(timer);
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

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoSources = ["/Hero_Video/Hero Video.mp4"];

  const handleVideoEnd = () => {
    if (videoSources.length > 1) {
      setCurrentVideoIndex((prev: number) => (prev + 1) % videoSources.length);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-[300vh] bg-jade-dark text-white" // Extended height for scroll testing
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {/* 1. Navigation & Header */}
      <Navbar />

      {/* Fixed Header Elements (Logo & Contact) */}

      {/* 2. Hero Section (Parallax) — fixed viewport height so absolute children anchor correctly */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100dvh" }}
      >
        <NavbarThemeTrigger theme="white" sectionRef={heroRef} />
        {/* Background Layer: Video Sequence */}
        <motion.div
          style={{ y: yBackground }}
          className="absolute inset-0 w-full h-[120%] z-0"
        >
          <AnimatePresence mode="wait">
            <motion.video
              key={currentVideoIndex}
              autoPlay
              muted
              playsInline
              loop={videoSources.length === 1}
              onEnded={handleVideoEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source
                src={videoSources[currentVideoIndex].replace(".mp4", ".webm")}
                type="video/webm"
              />
              <source src={videoSources[currentVideoIndex]} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>

        {/* Text Content Layer — Centered on screen */}
        <motion.div
          style={{ y: useTransform(scrollY, [0, 500], ["0%", "15%"]) }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 md:px-12 max-w-[1920px] mx-auto"
        >
          {/* Text Group — Tight Gestalt proximity grouping */}
          <div className="max-w-5xl flex flex-col items-center gap-0">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-gh-label tracking-[0.3em] text-jade-gold uppercase font-manrope font-bold"
              style={{ marginBottom: "clamp(6px, 1.5vw, 12px)" }}
            >
              JADE HOSPITAINMENT
            </motion.p>

            {/* Title — tight to label above, tight to subtext below */}
            <motion.h1
              className="font-philosopher text-gh-h1 leading-[1.1] text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              style={{ marginBottom: "clamp(8px, 2vw, 16px)" }}
            >
              <div className="block">Where Hospitality</div>
              <div className="block">Meets Entertainment</div>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-gh-body font-light text-[#FAFAFA] max-w-xl font-manrope leading-relaxed"
            >
              Private themed farmhouse villas in serene locations of Bangalore,
              curated for gatherings and getaways.
            </motion.p>
          </div>
        </motion.div>

        {/* "SCROLL TO EXPERIENCE" — Pinned to bottom of hero, outside text group */}
        <motion.button
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          initial={{ opacity: 0, y: 20 }}
          animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="absolute z-10 bottom-6 md:bottom-10 inset-x-0 mx-auto w-fit flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-gh-label tracking-[0.2em] font-manrope text-white/60 uppercase">
            Scroll to Experience
          </span>
          {/* Vertical Line */}
          <div className="h-16 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
        </motion.button>
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
