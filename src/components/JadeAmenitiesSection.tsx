"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import { usePreloadNeighborSlideImages } from "@/lib/carouselMotion";
import {
  heroSplitBgVariants,
  heroSplitCardVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";

const AMENITIES = [
  {
    title: "WHAT COMES WITH STAYING AT JADE",
    heading: ["Culinary", "Experiences"],
    subtext:
      "From private chef dinners to starlit barbecues crafted in your villa.",
    tags: ["Private Chef", "Barbecue Setup", "Custom Menus"],
    bgImage:
      "/Home Page/What Comes With Staying At Jade/culinary experiences.webp",
    cardImage:
      "/Home Page/What Comes With Staying At Jade/culinary experiences 2.webp",
  },
  {
    title: "WHAT COMES WITH STAYING AT JADE",
    heading: ["Leisure &", "Entertainment"],
    subtext:
      "Immersive games, private pools, and home theatre screening rooms.",
    tags: ["Private Pools", "Home Theatre", "Indoor Games"],
    bgImage:
      "/Home Page/What Comes With Staying At Jade/leisure & enterta....webp",
    cardImage: "/Home Page/What Comes With Staying At Jade/leisure & ....webp",
  },
  {
    title: "WHAT COMES WITH STAYING AT JADE",
    heading: ["Wellness", "& Nature"],
    subtext:
      "Alfresco dining, lush lawns, and open-air decks in serene surroundings.",
    tags: ["Expansive Lawns", "Alfresco Dining", "Open Decks"],
    bgImage:
      "/Home Page/What Comes With Staying At Jade/Wellness & Nature.webp",
    cardImage:
      "/Home Page/What Comes With Staying At Jade/Wellness & Naturee.webp",
  },
  {
    title: "WHAT COMES WITH STAYING AT JADE",
    heading: ["Seamless", "Hospitality"],
    subtext: "Round-the-clock concierge support and premium housekeeping.",
    tags: ["24/7 Support", "Housekeeping", "Butler Service"],
    bgImage: "/Experiences/Corporate Retreats/1-Hero/xhero.webp",
    cardImage: "/Experiences/Weekend Getaways/1-Hero/casual stays.webp",
  },
];

export default function JadeAmenitiesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const currentSlide = AMENITIES[currentIndex];

  usePreloadNeighborSlideImages(AMENITIES, currentIndex);

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? AMENITIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === AMENITIES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-0 md:min-h-screen w-full overflow-hidden bg-[#25282C] flex flex-col"
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />

      {/* ── GLOBAL SWIPE OVERLAY ── */}
      <motion.div
        className="absolute inset-0 z-10"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);
          if (swipe < -swipeConfidenceThreshold) handleNext();
          else if (swipe > swipeConfidenceThreshold) handlePrev();
        }}
      />

      {/* ── TOP AREA (75vh mobile / 80vh desktop) — background image ── */}
      <div
        className="relative w-full h-[75vh] md:h-[80vh] z-0 overflow-hidden shrink-0 bg-[#0B2C23]"
        style={{ perspective: "1500px" }}
      >
        {/* Background Overlay Pattern for the Green part */}
        <div className="absolute inset-0 bg-diamond-pattern opacity-40 pointer-events-none z-10" />

        <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
          <motion.div
            key={`bg-${currentIndex}`}
            custom={carouselCustom}
            variants={heroSplitBgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src={currentSlide.bgImage}
              alt="Background"
              fill
              className="object-cover"
              sizes="100vw"
              priority={currentIndex === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B2C23]/80 via-[#0B2C23]/30 to-[#25282C]" />
          </motion.div>
        </AnimatePresence>

        {/* ── TEXT ── */}
        <div className="absolute inset-x-0 top-[10vh] z-20 flex flex-col items-center text-center px-6 sm:px-10 pointer-events-none">
          <motion.p
            key={`label-${currentIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-gh-label font-bold tracking-[0.3em] uppercase text-[#EFCD62]"
            style={{ marginBottom: "clamp(4px, 1vw, 8px)" }}
          >
            {currentSlide.title}
          </motion.p>
          <div style={{ marginBottom: "clamp(6px, 1.5vw, 12px)" }}>
            <h2 className="font-philosopher text-gh-h1 text-white leading-tight lg:whitespace-nowrap">
              {currentSlide.heading.join(" ")}
            </h2>
          </div>
          <motion.p
            key={`sub-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.06, duration: 0.38 }}
            className="font-manrope text-gh-carousel-sub text-white/80 leading-relaxed max-w-xl mx-auto line-clamp-3"
          >
            {currentSlide.subtext}
          </motion.p>
        </div>
      </div>

      {/* ── BOTTOM AREA ── */}
      <div className="relative w-full h-[12vh] md:h-[20vh] z-10 bg-[#25282C]" />

      {/* ── SPACER — exactly 40px gap ── */}
      <div className="hidden md:block h-[40px] bg-[#25282C]" />

      {/* ── ARROWS ── */}
      <button
        onClick={handlePrev}
        aria-label="Previous"
        className="absolute left-4 sm:left-8 lg:left-16 xl:left-28 top-[75vh] md:top-[80vh] -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next"
        className="absolute right-4 sm:right-8 lg:right-16 xl:right-28 top-[75vh] md:top-[80vh] -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:translate-x-1 transition-transform" />
      </button>

      {/* ── FEATURE CARD ── */}
      <div
        className="absolute top-[75vh] md:top-[80vh] -translate-y-1/2 left-1/2 -translate-x-1/2 z-30
                      w-[45vw] max-w-[280px] sm:w-[35vw] sm:max-w-[320px] lg:w-[24vw] lg:max-w-[380px] xl:w-[20vw]
                      aspect-[4/3]
                      shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden border border-white/20"
      >
        <motion.div
          className="flex w-full h-full cursor-grab active:cursor-grabbing"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ willChange: "transform" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) handleNext();
            else if (swipe > swipeConfidenceThreshold) handlePrev();
          }}
        >
          {AMENITIES.map((amenity, idx) => (
            <div key={`card-${idx}`} className="w-full h-full relative flex-shrink-0">
              <Image
                src={amenity.cardImage}
                alt="Feature"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 55vw, (max-width: 1024px) 45vw, 32vw"
                priority={true}
                loading="eager"
              />
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
