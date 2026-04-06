"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
      "Private pool villas with sprawling lawns designed for structured activities, team engagement, and relaxed downtime. Suitable for both intimate groups and larger gatherings.",
    image1:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600",
    image2:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Offsites & Workations",
    description:
      "Inspiring workspaces with presentation setups and high-speed Wi-Fi, complemented by customised meals and curated team-building activities.",
    image1: "/X/Magnolia/16.webp",
    image2:
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
  },
  {
    title: "Conference & Recognition Meets",
    description:
      "Elegant indoor-outdoor setups with LED screens and structured seating, tailored for reward and recognition ceremonies, followed by curated dinners, drinks, and DJ-led evenings.",
    image1:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600",
    image2: "/X/Magnolia/16.webp",
  },
  {
    title: "Corporate Events & Parties",
    description:
      "Ideal for celebrating milestones, company anniversaries, success parties, and employee appreciation ceremonies in private, well-curated settings.",
    image1:
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
    image2:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function FormatsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % FORMATS.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + FORMATS.length) % FORMATS.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      {/* SECTION HEADER: Tightened mb-8 lg:mb-12 */}
      <div className="flex flex-col mb-4 md:mb-[16px]">
        <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-[14px] font-manrope">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 items-start">
        {/* IMAGES: Optimized for 8pt Spacing grid */}
        <div className="relative order-1 lg:order-1">
          <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/3] w-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50;
                  if (swipe && offset.x > 0) prev();
                  else if (swipe && offset.x < 0) next();
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
                      priority
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
          </div>
        </div>

        {/* CONTENT: Balanced Side content - 8pt system */}
        <div className="flex flex-col justify-start lg:pt-4 order-2 lg:order-2">
          <div className="space-y-4 md:space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
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
