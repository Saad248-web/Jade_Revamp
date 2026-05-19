"use client";

import { useRef, useEffect, useMemo, useState } from "react";
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
import { getLenis, scrollToY } from "@/lib/lenis";

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

  const heroFallbackImage = "/Home Page/4-Venue Images/1.webp";

  type VideoSource = { mp4: string; webm?: string };

  const videoPlaylist = useMemo(
    () =>
      [
        // Online, high-quality “party / pool / celebration” vibe clips.
        // If any CDN blocks hotlinking, the local fallback below will still work.
        {
          mp4: "https://cdn.coverr.co/videos/coverr-people-at-a-party-9719/1080p.mp4",
        },
        {
          mp4: "https://cdn.coverr.co/videos/coverr-cheers-with-champagne-9497/1080p.mp4",
        },
        {
          mp4: "https://cdn.coverr.co/videos/coverr-pool-party-people-having-fun-2331/1080p.mp4",
        },
        {
          mp4: "https://cdn.coverr.co/videos/coverr-dj-turntable-9158/1080p.mp4",
        },
        {
          mp4: "https://cdn.coverr.co/videos/coverr-fireworks-over-the-city-9159/1080p.mp4",
        },
      ] as VideoSource[],
    [],
  );

  useEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }

    scrollToY(0, { immediate: true });

    // Recalculate scroll height when lazy sections mount — do not force scroll position
    const timer = setTimeout(() => getLenis()?.resize(), 800);

    return () => {
      if (history.scrollRestoration) {
        history.scrollRestoration = "auto";
      }
      clearTimeout(timer);
    };
  }, []);

  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], ["0%", "40%"]);
  const heroContentY = useTransform(scrollY, [0, 500], ["0%", "15%"]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(() =>
    Math.floor(Math.random() * videoPlaylist.length),
  );

  const handleVideoEnd = () => {
    if (videoPlaylist.length > 1) {
      setCurrentVideoIndex((prev: number) => (prev + 1) % videoPlaylist.length);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-jade-dark text-white"
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
              preload="metadata"
              poster={heroFallbackImage}
              loop={videoPlaylist.length === 1}
              onEnded={handleVideoEnd}
              onError={handleVideoEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover"
            >
              {videoPlaylist[currentVideoIndex]?.webm ? (
                <source
                  src={videoPlaylist[currentVideoIndex].webm}
                  type="video/webm"
                />
              ) : null}
              <source src={videoPlaylist[currentVideoIndex].mp4} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
          <div className="absolute inset-0 z-[-1]">
            <Image
              src={heroFallbackImage}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>

        {/* Foreground — copy + CTA share the same scroll parallax */}
        <motion.div
          style={{ y: heroContentY }}
          className="relative z-10 h-full flex flex-col justify-between items-center text-center px-6 md:px-12 max-w-[1920px] mx-auto pointer-events-none"
        >
          <motion.div className="flex-1 flex flex-col justify-center items-center w-full">
            <motion.div className="max-w-5xl flex flex-col items-center gap-0 pointer-events-auto">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-gh-label tracking-[0.3em] text-jade-gold uppercase font-manrope font-bold"
              style={{ marginBottom: "clamp(4px, 0.96vw, 8px)" }}
            >
              JADE HOSPITAINMENT
            </motion.p>

            {/* Title — tight to label above, tight to subtext below */}
            <motion.h1
              className="font-philosopher text-gh-h1 leading-[1.1] text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              style={{ marginBottom: "clamp(8px, 1.28vw, 10.2px)" }}
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
            </motion.div>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => scrollToY(window.innerHeight, { duration: 1.1 })}
            initial={{ opacity: 0, y: 20 }}
            animate={isSplashComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="pointer-events-auto w-fit flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mb-[calc(7rem+env(safe-area-inset-bottom))] lg:mb-8"
          >
            <span className="text-gh-label tracking-[0.2em] font-manrope text-white/60 uppercase">
              Scroll to Experience
            </span>
            <div className="h-16 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
          </motion.button>
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
