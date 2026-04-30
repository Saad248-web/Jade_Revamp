"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Users, Car, Home, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { getHeroOverrideForId } from "@/lib/heroOverrides";
import { getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import { getOverlayVillaData } from "@/lib/overlayVillaData";

const normalizePublicImageSrc = (src: string) => {
  if (!src.startsWith("/")) return src;
  return src.replace(/ /g, "%20").replace(/#/g, "%23").replace(/\?/g, "%3F");
};

type VillaGalleryItem = { name: string; image: string };

function buildVillaGalleryImages(villa: any, max = 8) {
  const sources: Array<string | undefined | null> = [
    ...(getHeroOverrideForId(villa?.id) || []),
    ...((villa?.images as string[] | undefined) || []),
    ...(((villa?.spaces as any[] | undefined) || []).map((s) => s?.image)),
    ...(((villa?.activities as any[] | undefined) || []).map((a) => a?.image)),
    villa?.image,
  ];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of sources) {
    if (!raw || typeof raw !== "string") continue;
    const normalized = normalizePublicImageSrc(raw);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= max) break;
  }
  return out;
}

interface WeekendVillaCardProps {
  villa: any;
  onKnowMore: () => void;
}

export default function WeekendVillaCard({
  villa,
  onKnowMore,
}: WeekendVillaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const gallery = buildVillaGalleryImages(villa, 8);
  const derived =
    gallery.length > 0
      ? gallery.map((img, idx) => ({
          name: `Gallery ${idx + 1}`,
          image: img,
        }))
      : [];

  const images =
    (derived.length > 0
      ? derived
      : villa.spaces?.length > 0
      ? villa.spaces
      : [{ name: "Main", image: villa.image }]) as VillaGalleryItem[];

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentSpace = images[currentImageIndex];

  const stats = [
    {
      label: "Guests",
      value:
        getEventCapacity(villa)?.toString() ||
        villa.stats?.events?.split(" ")[0] ||
        "15+",
      icon: Users,
    },
    { label: "Parking", value: "20+", icon: Car },
    {
      label: "Stay",
      value:
        getStayCapacity(villa)?.toString() ||
        villa.stats?.stay?.split(" ")[0] ||
        "6-12",
      icon: Home,
    },
  ];

  const onwards = (getOverlayVillaData("weekend", villa?.id) as any)?.overlay?.onwardsPrice ?? null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-14 w-full pb-8 lg:py-10 border-b border-white/5 last:border-b-0 bg-[#25282C]">
      {/* IMAGE SECTION */}
      <div className="relative w-full lg:w-[45%] h-[38vh] lg:h-[360px] xl:h-[420px] overflow-hidden bg-white/5 flex-shrink-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`${villa.id}-${currentImageIndex}`}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
            <span className="text-white font-manrope text-gh-label font-bold tracking-[0.3em] uppercase mb-2 text-center">
              {currentSpace.name || "VILLA"}
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
      <div className="flex flex-col flex-1 px-6 md:px-8 lg:px-0 pt-6 lg:pt-0 justify-start">
        <span className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.25em] uppercase mb-2">
          {villa.type || "PRIVATE RETREAT"}
        </span>

        <h2 className="font-philosopher text-gh-h3 text-white leading-tight mb-2">
          {villa.name}
        </h2>

        <div className="flex items-center gap-2 text-white/50 mb-3">
          <MapPin className="w-5 h-5 text-[#EFCD62]" />
          <span className="font-manrope text-gh-body tracking-wide">
            {villa.location}
          </span>
        </div>

        <p className="font-manrope text-white/50 leading-relaxed text-gh-desc mb-6 line-clamp-2 md:line-clamp-none">
          {villa.description?.split(".")[0]}. Ideal for{" "}
          <span className="text-white/80 font-bold">weekend escapes</span> and
          intimate celebrations.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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
            {onwards ? `${onwards} onwards` : "Enquire for pricing"}
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
