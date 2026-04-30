"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

const SLIDES = [
  {
    id: 1,
    label: "PERFECT FOR",
    heading: ["Family Road", "Trips"],
    subtext: "Reconnect and explore scenic destinations together.",
    bgImage: "/X/Tranquil Woods/1.webp",
    cardImage: "/X/Tranquil Woods/1.webp",
  },
  {
    id: 2,
    label: "PERFECT FOR",
    heading: ["Romantic", "Getaways"],
    subtext: "Private journeys designed for couples seeking quiet escapes.",
    bgImage: "/X/Dome Villas/Red Dome/1.webp",
    cardImage: "/X/Dome Villas/Red Dome/1.webp",
  },
  {
    id: 3,
    label: "PERFECT FOR",
    heading: ["Private", "Celebrations"],
    subtext: "Birthdays, proposals, bridal showers, and milestone moments.",
    bgImage: "/X/HAVEN/pool new.webp",
    cardImage: "/X/HAVEN/pool new.webp",
  },
  {
    id: 4,
    label: "PERFECT FOR",
    heading: ["One-Day", "Escapes"],
    subtext:
      "Short journeys outside the city without the need for overnight stays.",
    bgImage: "/X/Tranquil Woods/3.webp",
    cardImage: "/X/Tranquil Woods/3.webp",
  },
  {
    id: 5,
    label: "PERFECT FOR",
    heading: ["Content Shoots", "& Creative Projects"],
    subtext:
      "Unique mobile spaces for filming, photography, and creative work.",
    bgImage: "/X/Magnolia/14.webp",
    cardImage: "/X/Magnolia/14.webp",
  },
  {
    id: 6,
    label: "PERFECT FOR",
    heading: ["Work on", "the Move"],
    subtext:
      "A quiet mobile environment for offsites, brainstorming, or remote work.",
    bgImage: "/Experiences/Caravan/1-Hero/14.webp",
    cardImage: "/Experiences/Caravan/2-Spaces/1.webp",
  },
];

export default function CaravanUsageSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const currentSlide = SLIDES[currentIndex];

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen max-h-screen w-full overflow-hidden bg-[#0D4032]"
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />

      {/* ── TOP 80vh — full-bleed background image ── */}
      <div className="absolute inset-x-0 top-0 h-[80vh] z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentSlide.bgImage}
              alt="Background"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D4032]/90 via-[#0D4032]/25 to-[#0D4032]/55" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── BOTTOM 20vh — solid charcoal anchor ── */}
      <div className="absolute inset-x-0 bottom-0 h-[20vh] z-10 bg-[#0D4032]" />

      {/* ── TEXT ── */}
      <div className="absolute inset-x-0 top-[8vh] z-20 flex flex-col items-center text-center px-6 sm:px-10 pointer-events-none">
        <motion.p
          key={`label-${currentIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-manrope text-gh-label font-bold tracking-[0.3em] uppercase text-[#EFCD62] mb-3"
        >
          {currentSlide.label}
        </motion.p>
        <div className="mb-3">
          <motion.h2
            key={`heading-${currentIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-philosopher text-gh-h1 text-white leading-tight lg:whitespace-nowrap"
          >
            {currentSlide.heading.join(" ")}
          </motion.h2>
        </div>
        <motion.p
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.22 }}
          className="font-manrope text-gh-carousel-sub text-white/80 leading-relaxed max-w-xl mx-auto line-clamp-3"
        >
          {currentSlide.subtext}
        </motion.p>
      </div>

      {/* ── ARROWS ── */}
      <button
        onClick={handlePrev}
        aria-label="Previous"
        className="absolute left-4 sm:left-8 lg:left-16 xl:left-28 top-[80vh] -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next"
        className="absolute right-4 sm:right-8 lg:right-16 xl:right-28 top-[80vh] -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:translate-x-1 transition-transform" />
      </button>

      {/* ── FEATURE CARD ── */}
      <div
        className="absolute top-[80vh] -translate-y-1/2 left-1/2 -translate-x-1/2 z-30
                      w-[45vw] max-w-[280px] sm:w-[35vw] sm:max-w-[320px] lg:w-[24vw] lg:max-w-[380px] xl:w-[20vw]
                      aspect-[4/3]
                      shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden border border-white/20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            <Image
              src={currentSlide.cardImage}
              alt="Feature"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 55vw, (max-width: 1024px) 45vw, 32vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
