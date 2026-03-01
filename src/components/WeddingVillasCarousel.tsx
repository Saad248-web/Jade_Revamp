"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Users, Car, Home } from "lucide-react";
import Link from "next/link";
import { VILLAS } from "@/data/villas";

// Filter villas to specifically show all 6 Wedding related venues
const WEDDING_VILLA_IDS = [
  "dome-villas",
  "the-haven",
  "retreat-on-the-ridge",
  "tranquil-woods",
  "magnolia",
  "diamond",
];
const WEDDING_VILLAS = VILLAS.filter((villa) =>
  WEDDING_VILLA_IDS.includes(villa.id),
);

export default function WeddingVillasCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % WEDDING_VILLAS.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + WEDDING_VILLAS.length) % WEDDING_VILLAS.length,
    );
  };

  const currentVilla = WEDDING_VILLAS[currentIndex];

  return (
    <section className="relative bg-[#0F1113] py-24 sm:py-32">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* LEFT: IMAGE SECTION WITH FLOATING NAVIGATION */}
          <div className="relative w-full aspect-[4/5] md:aspect-[4/5] lg:aspect-square lg:max-h-[80vh] overflow-hidden rounded-none bg-white/5">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentVilla.id}
                custom={direction}
                initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentVilla.image}
                  alt={currentVilla.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Bottom Overlay: Navigation & Pagination/Category */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center">
              <span className="text-white font-manrope text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase mb-6 opacity-100">
                LAWN
              </span>

              <div className="flex items-center gap-6 md:gap-10">
                {/* Previous Arrow */}
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/5 text-white hover:bg-[#EFCD62] hover:text-black transition-all"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 h-6" />
                </button>

                {/* Pagination */}
                <div className="flex items-center gap-4 md:gap-5">
                  <span className="text-white font-philosopher text-xl md:text-2xl min-w-[20px] text-center">
                    {currentIndex + 1}
                  </span>
                  <div className="w-16 md:w-20 h-px bg-white/60" />
                  <span className="text-white/60 font-philosopher text-xl md:text-2xl min-w-[20px] text-center">
                    {WEDDING_VILLAS.length}
                  </span>
                </div>

                {/* Next Arrow */}
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/5 text-white hover:bg-[#EFCD62] hover:text-black transition-all"
                >
                  <ArrowRight className="w-5 h-5 md:w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="flex flex-col h-full lg:pl-10">
            {/* Category Descriptor */}
            <motion.span
              key={`type-${currentVilla.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#EFCD62] text-[10px] md:text-sm font-manrope font-bold tracking-[0.25em] uppercase mb-4"
            >
              {currentVilla.type}
            </motion.span>

            {/* Title & Location */}
            <motion.div
              key={`content-${currentVilla.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-philosopher text-5xl md:text-7xl text-white mb-6 leading-tight">
                {currentVilla.name}
              </h2>
              <div className="flex items-center gap-2 text-white/50 mb-10">
                <MapPin className="w-5 h-5 text-[#EFCD62]" />
                <span className="font-manrope text-sm md:text-base tracking-wide">
                  {currentVilla.location}
                </span>
              </div>

              {/* Description */}
              <p className="font-manrope text-white/50 leading-relaxed mb-12 text-sm md:text-lg max-w-xl">
                {currentVilla.id === "tranquil-woods"
                  ? "A lush forest retreat offering primitive luxury and serene solitude."
                  : currentVilla.id === "magnolia"
                    ? "2 acre, contemporary glass farmhouse with lawns, halls, and poolside spaces for grand, multi-day weddings."
                    : currentVilla.id === "diamond"
                      ? "A magnificent property designed for high-profile events and luxury stays."
                      : currentVilla.description.split(".")[0] + "."}{" "}
                Ideal for{" "}
                <span className="text-white/80 font-bold">
                  intimate weddings
                </span>{" "}
                and pre-wedding ceremonies.
              </p>
            </motion.div>

            {/* Stats Box Grid */}
            <div className="grid grid-cols-3 gap-3 mb-12">
              {[
                {
                  label: "Guests",
                  value:
                    currentVilla.stats.events.split("-")[1]?.split(" ")[0] ||
                    currentVilla.stats.events.split(" ")[0] ||
                    "600",
                  icon: Users,
                },
                { label: "Parking", value: "80", icon: Car },
                {
                  label: "Stay",
                  value:
                    currentVilla.stats.stay.split("-")[1]?.split(" ")[0] ||
                    currentVilla.stats.stay.split(" ")[0] ||
                    "20",
                  icon: Home,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center py-8 md:py-10 border border-white/10 text-center rounded-none hover:border-[#EFCD62]/30 transition-colors duration-500"
                >
                  <stat.icon className="w-5 h-5 text-white/30 mb-4" />
                  <span className="text-white font-philosopher text-2xl md:text-4xl mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[#EFCD62]/80 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] font-manrope">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Row: Price & CTAs */}
            <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
              <span className="text-white font-manrope font-bold text-xl md:text-2xl tracking-tight">
                {currentVilla.id === "tranquil-woods"
                  ? "₹65,000"
                  : currentVilla.id === "magnolia" ||
                      currentVilla.id === "diamond"
                    ? "₹99,000"
                    : "₹75,000"}{" "}
                onwards
              </span>

              <Link
                href={`/villas/${currentVilla.id}`}
                className="inline-flex items-center gap-2 text-[#EFCD62] font-manrope text-sm md:text-base tracking-[0.2em] font-bold uppercase transition-all group lg:translate-y-0.5"
              >
                KNOW MORE
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
