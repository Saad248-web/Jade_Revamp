"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

const SLIDES = [
  {
    id: 1,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Private villas", "around Bangalore"],
    subtext:
      "Located in serene yet accessible pockets around Bangalore, offering privacy without disconnect.",
    bgImage:
      "https://images.pexels.com/photos/32870/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: 2,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Distinctive,", "themed stays"],
    subtext:
      "From luxury pool villas and glass homes to landscaped farm estates — each space chosen for its character and versatility.",
    bgImage:
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: 3,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Curated", "experiences"],
    subtext:
      "More than just a stay — from private chef dining and starlit barbecues to curated recreational setups tailored precisely for you.",
    bgImage:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

export default function ValuePropositionSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const currentSlide = SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen max-h-screen w-full overflow-hidden bg-[#25282C]"
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />

      {/* ── TOP 80vh — full-bleed background image ── */}
      <div className="absolute inset-x-0 top-0 h-[80vh] z-0 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={currentSlide.bgImage}
            alt="Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* gradient: dark top for text legibility, fades to visible mid */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#25282C]/90 via-[#25282C]/25 to-[#25282C]/55" />
        </div>
      </div>

      {/* ── BOTTOM 20vh — solid charcoal anchor ── */}
      <div className="absolute inset-x-0 bottom-0 h-[20vh] z-10 bg-[#25282C]" />

      {/* ── TEXT — sits inside the image zone, near the top ── */}
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
          <h2 className="font-philosopher text-gh-h1 text-white leading-tight lg:whitespace-nowrap">
            {currentSlide.heading.join(" ")}
          </h2>
        </div>
        <motion.p
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="font-manrope text-gh-carousel-sub text-white/80 leading-relaxed max-w-xl mx-auto line-clamp-3"
        >
          {currentSlide.subtext}
        </motion.p>
      </div>

      {/* ── ARROWS — straddling the 70/30 seam ── */}
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

      {/* ── FEATURE CARD — perfectly centred on the seam ── */}
      <div
        className="absolute top-[80vh] -translate-y-1/2 left-1/2 -translate-x-1/2 z-30
                      w-[45vw] max-w-[280px] sm:w-[35vw] sm:max-w-[320px] lg:w-[24vw] lg:max-w-[380px] xl:w-[20vw]
                      aspect-[4/3]
                      shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden border border-white/20"
      >
        <motion.div
          key={`card-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative"
        >
          <Image
            src={currentSlide.bgImage}
            alt="Feature"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 55vw, (max-width: 1024px) 45vw, 32vw"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
