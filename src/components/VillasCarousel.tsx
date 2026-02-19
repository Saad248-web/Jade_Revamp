"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Bed, Users, Home, MapPin } from "lucide-react";
import Link from "next/link";
import { VILLAS, CATEGORIES } from "@/data/villas";

export default function VillasCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredVillas = VILLAS.filter(
    (villa) =>
      activeCategory === "All" || villa.categories.includes(activeCategory),
  );

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredVillas.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + filteredVillas.length) % filteredVillas.length,
    );
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setDirection(0);
  };

  // Guard against empty filtering (shouldn't happen with these categories but good practice)
  const currentVilla =
    filteredVillas.length > 0 ? filteredVillas[currentIndex] : null;

  return (
    <section
      id="villas-carousel"
      className="relative bg-[#1A1C1E] py-20 min-h-screen flex flex-col justify-center"
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full">
        {/* FILTERS */}
        <div className="flex overflow-x-auto items-center gap-2 md:gap-4 mb-12 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`whitespace-nowrap flex-shrink-0 px-4 py-2 text-xs md:text-sm font-manrope font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#EFCD62] text-[#1A1C1E] border border-[#EFCD62]"
                  : "bg-transparent text-white/60 border border-white/20 hover:border-white/50 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {currentVilla ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* IMAGE SECTION */}
            <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-sm group bg-white/5">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={`${currentVilla.id}-${currentIndex}`} // Unique key for animation
                  custom={direction}
                  initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 1 }} // Slide out to opposite side
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} // Smooth ease-out
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={currentVilla.image}
                    alt={currentVilla.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows (Static - Outside Animation) */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 md:gap-6 pb-2">
                  <span className="text-white font-manrope text-4xl md:text-5xl lg:text-6xl font-light leading-none">
                    {currentIndex + 1}
                  </span>
                  <div className="w-8 md:w-16 h-[1px] bg-white/40" />
                  <span className="text-white/60 font-manrope text-lg md:text-xl font-light leading-none">
                    {filteredVillas.length}
                  </span>
                </div>

                <button
                  onClick={nextSlide}
                  className="w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CONTENT SECTION */}
            <motion.div
              key={`content-${currentVilla.id}-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col text-left"
            >
              <span className="text-[#EFCD62] text-xs font-manrope font-bold tracking-[0.2em] uppercase mb-4">
                {currentVilla.type}
              </span>
              <h2 className="font-philosopher text-5xl md:text-6xl text-white mb-2">
                {currentVilla.name}
              </h2>
              <div className="flex items-center gap-2 text-white/60 mb-10">
                <MapPin className="w-4 h-4" />
                <span className="font-manrope text-sm">
                  {currentVilla.location}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-6 mb-8">
                <div className="flex flex-col items-center gap-3 text-center border-r border-white/10 last:border-0">
                  <Bed className="w-5 h-5 text-white/80" />
                  <span className="text-white font-philosopher text-lg">
                    {currentVilla.stats.stay}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-wider font-manrope">
                    Stay
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center border-r border-white/10 last:border-0">
                  <Users className="w-5 h-5 text-white/80" />
                  <span className="text-white font-philosopher text-lg">
                    {currentVilla.stats.events}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-wider font-manrope">
                    Events
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <Home className="w-5 h-5 text-white/80" />
                  <span className="text-white font-philosopher text-lg">
                    {currentVilla.stats.bhk}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-wider font-manrope">
                    Configuration
                  </span>
                </div>
              </div>

              <p className="font-manrope text-white/70 leading-relaxed mb-8 text-sm md:text-base">
                {currentVilla.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                <span className="text-white/40 text-xs font-manrope font-bold uppercase tracking-wider mr-2 self-center">
                  Perfect for:
                </span>
                {currentVilla.perfectFor.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/5 text-white/80 text-xs px-3 py-1.5 rounded-sm font-manrope"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/villas/${currentVilla.id}`}
                className="w-full bg-[#EFCD62] text-black py-4 font-manrope font-bold text-xs tracking-[0.2em] uppercase text-center hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                View {currentVilla.name} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        ) : (
          // No results fallback
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <span className="text-white/40 font-manrope text-lg">
              No villas found for "{activeCategory}".
            </span>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-4 text-[#EFCD62] font-manrope underline underline-offset-4"
            >
              View All Villas
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
