"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CAROUSEL_CROSSFADE } from "@/lib/carouselMotion";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";
import {
  liquidCarouselBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";

interface Format {
  title: string;
  description: string;
  image1: string;
  image2: string;
}

const FORMATS: Format[] = [
  {
    title: "Corporate Team Outings",
    description:
      "Private pool VILLAS with sprawling lawns designed for structured activities, team engagement, and relaxed downtime. Suitable for both intimate groups and larger gatherings.",
    image1:
      "/Experiences/Corporate Retreats/2-Formats/corporate team outings.webp",
    image2:
      "/Experiences/Corporate Retreats/2-Formats/offsite and work....webp",
  },
  {
    title: "Offsites & Workations",
    description:
      "Inspiring workspaces with presentation setups and high-speed Wi-Fi, complemented by customised meals and curated team-building activities.",
    image1: "/Experiences/Corporate Retreats/2-Formats/offsite and work....webp",
    image2: "/Experiences/Corporate Retreats/2-Formats/corporate team outings.webp",
  },
  {
    title: "Conference & Recognition Meets",
    description:
      "Elegant indoor-outdoor setups with LED screens and structured seating, tailored for reward and recognition ceremonies, followed by curated dinners, drinks, and DJ-led evenings.",
    image1:
      "/Experiences/Corporate Retreats/2-Formats/Conference and....webp",
    image2: "/Experiences/Corporate Retreats/2-Formats/offsite and work....webp",
  },
  {
    title: "Corporate Events & Parties",
    description:
      "Ideal for celebrating milestones, company anniversaries, success parties, and employee appreciation ceremonies in private, well-curated settings.",
    image1: "/Experiences/Corporate Retreats/2-Formats/corporate team outings.webp",
    image2:
      "/Experiences/Corporate Retreats/2-Formats/offsite and work....webp",
  },
];

export default function FormatsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reducedMotion = useReducedMotion();

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

  useEffect(() => {
    const n = FORMATS.length;
    if (n <= 1) return;
    for (const j of [(index + 1) % n, (index - 1 + n) % n]) {
      const f = FORMATS[j];
      [f.image1, f.image2].forEach((src) => {
        if (src?.trim()) {
          const img = new window.Image();
          img.src = src;
        }
      });
    }
  }, [index]);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % FORMATS.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + FORMATS.length) % FORMATS.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      {/* SECTION HEADER: Tightened mb-8 lg:mb-12 */}
      <div className="flex flex-col mb-3 md:mb-[12.8px]">
        <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-[11.2px] font-manrope">
          CORPORATE EXPERIENCE AT JADE
        </p>
        <div className="flex items-center justify-between w-full">
          <h2 className="text-gh-h1 font-philosopher text-white">Formats</h2>
          <div className="flex gap-px pt-2">
            <button
              onClick={prev}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white/10 bg-[#1E2023] hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white/10 bg-[#1E2023] hover:bg-white/10 transition-colors"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-10 items-start">
        {/* IMAGES: Optimized for 8pt Spacing grid */}
        <div className="relative order-1 lg:order-1">
          <div
            className="relative overflow-hidden aspect-[4/3] md:aspect-[16/9] w-full"
            style={{ perspective: "1200px" }}
          >
            <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
              <motion.div
                key={index}
                custom={carouselCustom}
                variants={liquidCarouselBgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex flex-col h-full">
                  <div className="relative flex-1 w-full overflow-hidden">
                    <Image
                      src={FORMATS[index].image1}
                      alt={FORMATS[index].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                  <div className="relative flex-1 w-full overflow-hidden border-t border-white/5">
                    <Image
                      src={FORMATS[index].image2}
                      alt={FORMATS[index].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <CarouselSwipeLayer
              onPrev={prev}
              onNext={next}
              slideCount={FORMATS.length}
            />
          </div>
        </div>

        {/* CONTENT: Balanced Side content - 8pt system */}
        <div className="flex flex-col justify-start lg:pt-4 order-2 lg:order-2">
          <div className="space-y-3 md:space-y-5">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: CAROUSEL_CROSSFADE.duration,
                  ease: CAROUSEL_CROSSFADE.ease,
                }}
              >
                <h3 className="text-gh-scroll font-philosopher text-white mb-2 md:mb-[8px]">
                  {FORMATS[index].title}
                </h3>
                <p className="text-white/70 font-manrope text-gh-body leading-relaxed max-w-xl">
                  {FORMATS[index].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
