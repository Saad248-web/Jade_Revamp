"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Users,
  Car,
  Home,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Presentation,
} from "lucide-react";

interface CorporateVillaCardProps {
  villa: any; // Type from VILLAS
  onKnowMore: () => void;
}

export default function CorporateVillaCard({
  villa,
  onKnowMore,
}: CorporateVillaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const images =
    villa.spaces?.length > 0
      ? villa.spaces
      : [{ name: "Main", image: villa.image }];

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentSpace = images[currentImageIndex];

  // Corporate-specific stats mapping
  const stats = [
    {
      label: "Offsite Cap.",
      value: villa.stats.events.split(" ")[0] || "500",
      icon: Users,
    },
    {
      label: "Meeting Space",
      value: villa.stats.lawn || villa.stats.villaArea || "Lawn",
      icon: Presentation,
    },
    {
      label: "Stay Cap.",
      value: villa.stats.stay.split(" ")[0] || "20",
      icon: Home,
    },
  ];

  const price = "₹75,000"; // Default corporate starting price

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full pb-8 lg:py-8 border-b border-white/5 last:border-b-0 bg-[#1A1C1E] min-h-[calc(100vh-80px)] lg:min-h-0">
      {/* IMAGE SECTION */}
      <div className="relative w-full lg:w-1/2 h-[45vh] lg:h-auto overflow-hidden bg-white/5 flex-shrink-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`${villa.id}-${currentImageIndex}`}
            custom={direction}
            initial={{ x: direction > 0 ? "10%" : "-10%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? "-10%" : "10%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentSpace.image}
              alt={currentSpace.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* IMAGE CONTROLS */}
        <div className="absolute bottom-6 left-4 right-4 z-20 flex items-center justify-between">
          <button
            onClick={prevImage}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-[#EFCD62] hover:text-black transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-white font-manrope text-gh-label font-bold tracking-[0.3em] uppercase mb-2">
              {currentSpace.name || "ESTATE"}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-white font-philosopher text-gh-scroll">
                {currentImageIndex + 1}
              </span>
              <div className="w-12 h-[1px] bg-white/40" />
              <span className="text-white/60 font-philosopher text-gh-scroll">
                {images.length}
              </span>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-[#EFCD62] hover:text-black transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-col flex-1 px-4 lg:px-0 pt-6 lg:pt-0 lg:max-w-2xl justify-start">
        <span className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.25em] uppercase mb-4">
          {villa.type}
        </span>

        <h2 className="font-philosopher text-gh-h3 text-white mb-2 leading-tight">
          {villa.name}
        </h2>

        <div className="flex items-center gap-2 text-white/50 mb-2">
          <MapPin className="w-5 h-5 text-[#EFCD62]" />
          <span className="font-manrope text-gh-body tracking-wide">
            {villa.location}
          </span>
        </div>

        <p className="font-manrope text-white/50 leading-relaxed mb-4 text-gh-desc line-clamp-2 md:line-clamp-none">
          {villa.description.split(".")[0]}. Designed for{" "}
          <span className="text-white/80 font-bold">
            focused corporate retreats
          </span>{" "}
          and leadership sessions.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center py-4 border border-white/10 text-center hover:border-[#EFCD62]/30 transition-colors"
            >
              <stat.icon className="w-4 h-4 text-white/30 mb-2" />
              <span className="text-white font-philosopher text-gh-scroll md:text-gh-h3 mb-1 truncate w-full px-2">
                {stat.value}
              </span>
              <span className="text-[#EFCD62]/80 uppercase font-bold tracking-[0.2em] font-manrope text-gh-label">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-row items-center justify-between pt-4">
          <span className="text-white font-manrope font-bold text-gh-label tracking-tight">
            {price} onwards
          </span>

          <button
            onClick={onKnowMore}
            className="inline-flex items-center gap-2 text-[#EFCD62] font-manrope text-gh-desc tracking-[0.2em] font-bold uppercase transition-all group"
          >
            KNOW MORE
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
