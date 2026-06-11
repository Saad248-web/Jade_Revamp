"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselHeroScrim from "./CarouselHeroScrim";
import {
  carouselHeroCopyRootCompact,
  carouselHeroHeadlineClass,
  carouselHeroLabelClass,
  carouselHeroSubtextClass,
} from "@/lib/carouselHeroCopy";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import {
  useCarouselSwipeDragProps,
  usePreloadNeighborSlideImages,
} from "@/lib/carouselMotion";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";
import CarouselHeroMiniFrame from "@/components/ui/CarouselHeroMiniFrame";
import {
  heroSplitBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";

const SLIDES = [
  {
    id: 1,
    label: "PERFECT FOR",
    heading: ["Family Road", "Trips"],
    subtext: "Reconnect and explore scenic destinations together.",
    bgImage: "/Villa_Retreats/Tranquil Woods/1-Hero/Hero 1.webp",
    cardImage: "/Villa_Retreats/Tranquil Woods/1-Hero/Hero 1.webp",
  },
  {
    id: 2,
    label: "PERFECT FOR",
    heading: ["Romantic", "Getaways"],
    subtext: "Private journeys designed for couples seeking quiet escapes.",
    bgImage: "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/hero.webp",
    cardImage: "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/hero.webp",
  },
  {
    id: 3,
    label: "PERFECT FOR",
    heading: ["Private", "Celebrations"],
    subtext: "Birthdays, proposals, bridal showers, and milestone moments.",
    bgImage: "/Villa_Retreats/Haven/Spaces/Pool.webp",
    cardImage: "/Villa_Retreats/Haven/Spaces/Pool.webp",
  },
  {
    id: 4,
    label: "PERFECT FOR",
    heading: ["One-Day", "Escapes"],
    subtext:
      "Short journeys outside the city without the need for overnight stays.",
    bgImage: "/Villa_Retreats/Tranquil Woods/2-Spaces/Private Pool Villa.webp",
    cardImage: "/Villa_Retreats/Tranquil Woods/2-Spaces/Private Pool Villa.webp",
  },
  {
    id: 5,
    label: "PERFECT FOR",
    heading: ["Content Shoots", "& Creative Projects"],
    subtext:
      "Unique mobile spaces for filming, photography, and creative work.",
    bgImage: "/Villa_Retreats/Magnolia/Spaces/Private_Home_Theatre.webp",
    cardImage: "/Villa_Retreats/Magnolia/Spaces/Private_Home_Theatre.webp",
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
  const reducedMotion = useReducedMotion();

  const currentSlide = SLIDES[currentIndex];

  usePreloadNeighborSlideImages(SLIDES, currentIndex);

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const miniCardSwipeProps = useCarouselSwipeDragProps(handlePrev, handleNext);

  return (
    <section
      ref={sectionRef}
      className="relative h-[87vh] md:h-screen md:max-h-screen w-full overflow-hidden bg-[#0B2C23]"
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />

      <CarouselSwipeLayer
        onPrev={handlePrev}
        onNext={handleNext}
        slideCount={SLIDES.length}
      />

      {/* ── TOP 75vh/80vh — full-bleed background image ── */}
      <div
        className="absolute inset-x-0 top-0 h-[75vh] md:h-[80vh] z-0 overflow-hidden"
        style={{ perspective: "1500px" }}
      >
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
          </motion.div>
        </AnimatePresence>

        <CarouselHeroScrim variant="upper" />
      </div>

      {/* ── BOTTOM 12vh/20vh — solid charcoal anchor ── */}
      <div className="absolute inset-x-0 bottom-0 h-[12vh] md:h-[20vh] z-10 bg-[#0B2C23]" />

      {/* ── TEXT ── */}
      <div className={carouselHeroCopyRootCompact}>
        <motion.p
          key={`label-${currentIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${carouselHeroLabelClass} mb-2.5`}
        >
          {currentSlide.label}
        </motion.p>
        <div className="mb-2.5">
          <motion.h2
            key={`heading-${currentIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={carouselHeroHeadlineClass}
          >
            {currentSlide.heading.join(" ")}
          </motion.h2>
        </div>
        <motion.p
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.38 }}
          className={carouselHeroSubtextClass}
        >
          {currentSlide.subtext}
        </motion.p>
      </div>

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

      <CarouselHeroMiniFrame
        slideKey={`card-${currentIndex}`}
        carouselCustom={carouselCustom}
        miniCardSwipeProps={miniCardSwipeProps}
      >
        <Image
          src={currentSlide.cardImage}
          alt="Feature"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 55vw, (max-width: 1024px) 45vw, 32vw"
          priority={currentIndex === 0}
          loading="eager"
        />
      </CarouselHeroMiniFrame>
    </section>
  );
}
