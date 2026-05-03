"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Users, Car, Home } from "lucide-react";
import Link from "next/link";
import { VILLAS } from "@/lib/mockData";
import VenueOverlay from "./VenueOverlay";
import { useAnimation } from "@/context/AnimationContext";
import {
  liquidCarouselBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";

// Filter villas to specifically show Set 2: Tranquil Woods, Magnolia, Diamond
const SET2_IDS = ["tranquil", "magnolia", "diamond"];
const WEDDING_VENUES = VILLAS.filter((villa) => SET2_IDS.includes(villa.id));

export default function WeddingVenuesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { setEnquireOverlayOpen } = useAnimation();
  const reducedMotion = useReducedMotion();

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

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

  useEffect(() => {
    const n = WEDDING_VENUES.length;
    if (n <= 1) return;
    for (const j of [(currentIndex + 1) % n, (currentIndex - 1 + n) % n]) {
      const src = String(WEDDING_VENUES[j]?.image ?? "").trim();
      if (src) {
        const img = new window.Image();
        img.src = src;
      }
    }
  }, [currentIndex]);

  return (
    <section className="relative bg-[#1A1C1E] pt-fluid-lg pb-10 md:pt-fluid-xl md:pb-10">
      <div className="max-w-3xl mx-auto px-6 w-full">
        <div className="flex flex-col gap-12">
          {/* IMAGE SECTION - NAVIGATION INSIDE FRAME */}
          <div
            className="relative w-full aspect-[16/9] md:aspect-[2.4/1] lg:h-[48vh] lg:max-h-[520px] overflow-hidden rounded-sm bg-white/5 group"
            style={{ perspective: "1500px" }}
          >
            <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
              <motion.div
                key={currentVilla.id}
                custom={carouselCustom}
                variants={liquidCarouselBgVariants}
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
                  src={currentVilla.image}
                  alt={currentVilla.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority={currentIndex === 0}
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
              <button
                onClick={() => setEnquireOverlayOpen(true)}
                className="bg-black/40 backdrop-blur-md hover:bg-white hover:text-black text-white text-gh-label font-manrope font-semibold tracking-[0.2em] uppercase px-6 py-3 border border-white/20 transition-all duration-300"
              >
                Enquire Now
              </button>
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
              <span className="text-white font-manrope text-gh-label font-bold tracking-[0.3em] uppercase">
                LAWN
              </span>
              <div className="flex items-center gap-4">
                <span className="text-white font-philosopher text-gh-gallery-pagination tabular-nums leading-none">
                  {currentIndex + 1}
                </span>
                <div className="w-24 h-px bg-white/40 shrink-0" />
                <span className="text-white/40 font-philosopher text-gh-gallery-pagination tabular-nums leading-none">
                  {WEDDING_VENUES.length}
                </span>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION BELOW IMAGE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase">
                {currentVilla.type}
              </span>
              <h2
                className="font-philosopher text-gh-h1 text-white"
                style={{ marginBottom: "clamp(4px, 1vw, 8px)" }}
              >
                {currentVilla.name}
              </h2>
              <a
                href={getVillaGoogleMapsUrl(currentVilla)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 w-fit max-w-full rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                style={{ marginBottom: "clamp(12px, 2.5vw, 24px)" }}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="font-manrope text-gh-label hover:underline underline-offset-4">
                  {currentVilla.location}
                </span>
              </a>
              <p className="font-manrope text-white/70 leading-relaxed text-gh-body">
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
                  <span className="text-white font-philosopher text-gh-scroll">
                    {currentVilla.stats.events.split("-")[1]?.split(" ")[0] ||
                      "1500"}
                  </span>
                  <span className="text-white/40 text-gh-label uppercase tracking-widest font-manrope">
                    Guests
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center border-r border-white/10">
                  <Car className="w-5 h-5 text-white/40" />
                  <span className="text-white font-philosopher text-gh-scroll">
                    80
                  </span>
                  <span className="text-white/40 text-gh-label uppercase tracking-widest font-manrope">
                    Parking
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Home className="w-5 h-5 text-white/40" />
                  <span className="text-white font-philosopher text-gh-scroll">
                    {currentVilla.stats.stay.split("-")[1]?.split(" ")[0] ||
                      "50"}
                  </span>
                  <span className="text-white/40 text-gh-label uppercase tracking-widest font-manrope">
                    Stay
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-manrope font-bold text-gh-villa-footer-row">
                  ₹99,000 onwards
                </span>
                <button
                  type="button"
                  onClick={() => setIsOverlayOpen(true)}
                  className="inline-flex items-center gap-3 text-[#EFCD62] font-manrope text-gh-villa-footer-row tracking-[0.2em] font-bold uppercase hover:text-white transition-all group"
                >
                  KNOW MORE
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOverlayOpen && (
          <VenueOverlay
            isOpen={isOverlayOpen}
            onClose={() => setIsOverlayOpen(false)}
            villa={currentVilla}
            overlayPage="wedding"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
