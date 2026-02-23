"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Users, Car, Home } from "lucide-react";
import Link from "next/link";
import { VILLAS } from "@/data/villas";

// Filter villas to specifically show Set 2: Tranquil Woods, Magnolia, Diamond
const SET2_IDS = ["tranquil-woods", "magnolia", "diamond"];
const WEDDING_VENUES = VILLAS.filter((villa) => SET2_IDS.includes(villa.id));

export default function WeddingVenuesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % WEDDING_VENUES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + WEDDING_VENUES.length) % WEDDING_VENUES.length,
    );
  };

  const currentVilla = WEDDING_VENUES[currentIndex];

  return (
    <section className="relative bg-[#1A1C1E] py-24 sm:py-32">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="flex flex-col gap-12">
          {/* IMAGE SECTION - NAVIGATION INSIDE FRAME */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm bg-white/5 group">
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
                  sizes="(max-width: 1024px) 100vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </motion.div>
            </AnimatePresence>

            {/* Top Overlay Link (Like Reference Image) */}
            <div className="absolute top-6 left-6 z-20">
              <Link
                href="/weddings"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
            <div className="absolute top-6 right-6 z-20">
              <Link
                href="/contact"
                className="bg-black/40 backdrop-blur-md hover:bg-white hover:text-black text-white text-[10px] font-manrope font-semibold tracking-[0.2em] uppercase px-6 py-3 border border-white/20 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>

            {/* Edge Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-[#EFCD62] hover:text-black text-white transition-all backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-[#EFCD62] hover:text-black text-white transition-all backdrop-blur-sm border border-white/10"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Bottom Center Indicator (Label, Line, Numbers) - Elevated for Mobile Bottom Nav */}
            <div className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
              <span className="text-white font-manrope text-xs font-bold tracking-[0.3em] uppercase">
                LAWN
              </span>
              <div className="flex items-center gap-4">
                <span className="text-white font-philosopher text-2xl">
                  {currentIndex + 1}
                </span>
                <div className="w-24 h-px bg-white/40" />
                <span className="text-white/40 font-philosopher text-xl">
                  {WEDDING_VENUES.length}
                </span>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION BELOW IMAGE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="text-[#EFCD62] text-xs font-manrope font-bold tracking-[0.2em] uppercase">
                {currentVilla.type}
              </span>
              <h2 className="font-philosopher text-5xl md:text-6xl text-white mb-2">
                {currentVilla.name}
              </h2>
              <div className="flex items-center gap-2 text-white/60 mb-6">
                <MapPin className="w-4 h-4" />
                <span className="font-manrope text-sm">
                  {currentVilla.location}
                </span>
              </div>
              <p className="font-manrope text-white/70 leading-relaxed text-sm md:text-base max-w-2xl">
                {currentVilla.description.split(".")[0]}.{" "}
                {currentVilla.description.split(".")[1] || ""}. Built to support
                high-guest-count weddings and grand celebrations.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-10">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-8">
                <div className="flex flex-col items-center gap-2 text-center border-r border-white/10">
                  <Users className="w-5 h-5 text-white/40" />
                  <span className="text-white font-philosopher text-2xl">
                    {currentVilla.stats.events.split("-")[1]?.split(" ")[0] ||
                      "1500"}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-manrope">
                    Guests
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center border-r border-white/10">
                  <Car className="w-5 h-5 text-white/40" />
                  <span className="text-white font-philosopher text-2xl">
                    80
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-manrope">
                    Parking
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Home className="w-5 h-5 text-white/40" />
                  <span className="text-white font-philosopher text-2xl">
                    {currentVilla.stats.stay.split("-")[1]?.split(" ")[0] ||
                      "50"}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-manrope">
                    Stay
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white/40 text-xs font-manrope uppercase tracking-widest block mb-1">
                    Starting from
                  </span>
                  <span className="text-white font-manrope font-bold text-xl">
                    ₹99,000 onwards
                  </span>
                </div>
                <Link
                  href={`/villas/${currentVilla.id}`}
                  className="inline-flex items-center gap-3 text-[#EFCD62] font-manrope text-sm md:text-base tracking-[0.2em] font-bold uppercase hover:text-white transition-all group"
                >
                  SEE MORE
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
