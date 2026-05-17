"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselHeroScrim from "@/components/CarouselHeroScrim";
import {
  carouselHeroCopyRootCompact,
  carouselHeroHeadlineClass,
  carouselHeroLabelClass,
  carouselHeroSubtextClass,
} from "@/lib/carouselHeroCopy";
import { usePreloadNeighborSlideImages } from "@/lib/carouselMotion";
import {
  heroSplitBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";
export type SharedHeroSplitSlide = {
  label: string;
  heading: string[];
  subtext: string;
  bgImage: string;
  cardImage: string;
};

type SharedHeroSplitSectionProps = {
  slides: SharedHeroSplitSlide[];
  /** Shell background behind the lower band */
  bandColor?: string;
  className?: string;
  /**
   * `viewport` — standalone 80–85dvh (mobile) / 100dvh (desktop).
   * `fill` — stretch to parent height (use inside a sized flex column).
   */
  layout?: "viewport" | "fill";
};

/**
 * Full-viewport split hero + feature card carousel.
 * Mobile: fits within ~80–85dvh; desktop: 100dvh (NEXUS 06_LAYOUT: prefer dvh).
 */
export default function SharedHeroSplitSection({
  slides,
  bandColor = "#141517",
  className = "",
  layout = "viewport",
}: SharedHeroSplitSectionProps) {
  const shellHeight =
    layout === "viewport"
      ? "min-h-[80dvh] max-h-[85dvh] h-[85dvh] lg:min-h-[100dvh] lg:max-h-[100dvh] lg:h-[100dvh]"
      : "h-full min-h-0 max-h-none";
  const topBand =
    layout === "viewport"
      ? "h-[73dvh] lg:h-[80dvh]"
      : "h-[86%] max-h-[86%]";
  const bottomBand =
    layout === "viewport" ? "h-[12dvh] lg:h-[20dvh]" : "h-[14%]";
  const splitAnchor =
    layout === "viewport"
      ? "top-[73dvh] lg:top-[80dvh]"
      : "top-[86%]";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const currentSlide = slides[currentIndex];

  usePreloadNeighborSlideImages(slides, currentIndex);

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${shellHeight} ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-10"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragEnd={(_e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);
          if (swipe < -swipeConfidenceThreshold) handleNext();
          else if (swipe > swipeConfidenceThreshold) handlePrev();
        }}
      />

      <motion.div
        className={`absolute inset-x-0 top-0 z-0 overflow-hidden ${topBand}`}
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
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        <CarouselHeroScrim variant="upper" />
      </motion.div>

      <div
        className={`absolute inset-x-0 bottom-0 z-10 ${bottomBand}`}
        style={{ backgroundColor: bandColor }}
      />

      <motion.div className={carouselHeroCopyRootCompact}>
        <motion.p
          key={`label-${currentIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${carouselHeroLabelClass} mb-3`}
        >
          {currentSlide.label}
        </motion.p>
        <motion.h2
          key={`heading-${currentIndex}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${carouselHeroHeadlineClass} mb-3`}
        >
          {currentSlide.heading.join(" ")}
        </motion.h2>
        <motion.p
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.38 }}
          className={carouselHeroSubtextClass}
        >
          {currentSlide.subtext}
        </motion.p>
      </motion.div>

      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className={`absolute left-4 sm:left-8 lg:left-16 xl:left-28 ${splitAnchor} -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group`}
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className={`absolute right-4 sm:right-8 lg:right-16 xl:right-28 ${splitAnchor} -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group`}
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:translate-x-1 transition-transform" />
      </button>

      <motion.div
        className={`absolute ${splitAnchor} -translate-y-1/2 left-1/2 -translate-x-1/2 z-30 w-[45vw] max-w-[280px] sm:w-[35vw] sm:max-w-[320px] lg:w-[24vw] lg:max-w-[380px] xl:w-[20vw] aspect-[4/3] shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden border border-white/20`}
      >
        <motion.div
          className="flex w-full h-full cursor-grab active:cursor-grabbing"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ willChange: "transform" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) handleNext();
            else if (swipe > swipeConfidenceThreshold) handlePrev();
          }}
        >
          {slides.map((slide, idx) => (
            <motion.div
              key={`card-${idx}`}
              className="w-full h-full relative flex-shrink-0"
            >
              <Image
                src={slide.cardImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 55vw, (max-width: 1024px) 45vw, 32vw"
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
