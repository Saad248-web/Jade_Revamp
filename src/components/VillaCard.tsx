"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Bed,
  Users,
  Home,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { VILLAS } from "@/lib/mockData";
import PrimaryButton from "@/components/PrimaryButton";
import { useWishlist } from "@/context/WishlistContext";

interface VillaCardProps {
  villa: (typeof VILLAS)[0];
}

export default function VillaCard({ villa }: VillaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(villa.id);

  const wishlistItem = {
    id: villa.id,
    name: villa.name,
    type: villa.type,
    location: villa.location,
    image: villa.image,
    startingPrice:
      villa.pricing?.stay?.packages?.[0]?.price?.split(" ")[0] ?? null,
  };

  // If a villa doesn't have multiple spaces defined yet, we'll create a fallback array
  // of just its main image so the UI doesn't break.
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

  // Helper to extract the lowest price string if available
  const getStartingPrice = () => {
    if (villa.pricing?.stay?.packages?.[0]?.price) {
      return villa.pricing.stay.packages[0].price.split(" ")[0]; // Just grab "₹43,500"
    }
    return null;
  };
  const startingPrice = getStartingPrice();

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full pointer-events-auto">
      {/* IMAGE CONTAINER */}
      <div className="relative w-full md:w-[45%] md:flex-shrink-0 aspect-[4/3] md:aspect-auto md:max-h-[480px] overflow-hidden rounded-md group bg-white/5">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`${villa.id}-${currentImageIndex}`}
            custom={direction}
            initial={{ x: direction > 0 ? "10%" : "-10%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? "-10%" : "10%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentSpace.image}
              alt={`${villa.name} - ${currentSpace.name}`}
              fill
              className="object-cover"
            />
            {/* Dark gradient overlay for bottom text */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* WISHLIST HEART */}
        <button
          onClick={() => toggleWishlist(wishlistItem)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/20 hover:border-white/60 transition-colors rounded-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? "fill-red-400 text-red-400" : "text-white/70"
            }`}
          />
        </button>

        {/* IMAGE CONTROLS */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={prevImage}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Pagination Info */}
            <div className="flex flex-col flex-1 items-center px-4">
              <span className="text-white text-gh-label font-manrope font-bold tracking-widest uppercase mb-1">
                {currentSpace.name || "VIEW"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white font-manrope text-gh-label font-light">
                  {currentImageIndex + 1}
                </span>
                <div className="w-16 md:w-24 h-[1px] bg-white/40" />
                <span className="text-white/60 font-manrope text-gh-label font-light">
                  {images.length}
                </span>
              </div>
            </div>

            <button
              onClick={nextImage}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}
      </div>

      {/* DETAILS CONTAINER */}
      <div className="flex flex-col text-left flex-1 md:py-2">
        <span className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase mb-4">
          {villa.type}
        </span>
        <h2 className="font-philosopher text-gh-h2 text-white mb-2">
          {villa.name}
        </h2>
        <div className="flex items-center gap-2 text-white/60 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="font-manrope text-gh-body">{villa.location}</span>
        </div>

        <p className="font-manrope text-white/70 leading-relaxed text-gh-desc mb-4 line-clamp-2 lg:line-clamp-none">
          {villa.description}
        </p>

        {/* Stats Row */}
        <div className="flex flex-nowrap overflow-x-auto items-center gap-x-4 mb-4 text-white/80 font-manrope text-gh-label [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <div className="flex shrink-0 items-center gap-2">
            <Bed className="w-4 h-4 text-[#EFCD62]" />
            <span className="whitespace-nowrap">{villa.stats.stay}</span>
          </div>
          <div className="shrink-0 w-1 h-1 rounded-full bg-white/20" />
          <div className="flex shrink-0 items-center gap-2">
            <Users className="w-4 h-4 text-[#EFCD62]" />
            <span className="whitespace-nowrap">{villa.stats.events}</span>
          </div>
          <div className="shrink-0 w-1 h-1 rounded-full bg-white/20" />
          <div className="flex shrink-0 items-center gap-2">
            <Home className="w-4 h-4 text-[#EFCD62]" />
            <span className="whitespace-nowrap">{villa.stats.bhk}</span>
          </div>
          {villa.stats.lawn && (
            <>
              <div className="shrink-0 w-1 h-1 rounded-full bg-white/20" />
              <span className="shrink-0 whitespace-nowrap">
                {villa.stats.lawn}
              </span>
            </>
          )}
        </div>

        {/* Perfect For Tags */}
        <div className="flex flex-nowrap overflow-x-auto items-center gap-2 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <span className="shrink-0 text-white/40 text-gh-label font-manrope font-bold uppercase tracking-wider mr-1">
            Perfect for:
          </span>
          {villa.perfectFor.map((tag) => (
            <span
              key={tag}
              className="shrink-0 whitespace-nowrap bg-white/5 border border-white/10 text-white/80 text-gh-label px-2.5 py-1 rounded-sm font-manrope"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Row */}
        <div className="flex flex-row items-center justify-between gap-2 md:gap-4 mt-auto">
          {/* Price */}
          <div className="text-white font-manrope font-bold text-gh-label tracking-wide leading-tight line-clamp-2 md:line-clamp-1">
            {startingPrice || "Upon Request"}{" "}
            <span className="text-white/80 font-normal md:font-bold md:text-white inline-block">
              onwards
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link
              href={`/villas/${villa.id}?autoScroll=true`}
              className="border border-white/20 text-white hover:bg-white hover:text-black transition-colors px-3 py-2 md:px-5 md:py-2.5 font-manrope font-bold text-gh-desc tracking-widest uppercase text-center rounded-sm whitespace-nowrap"
            >
              VIEW VILLA
            </Link>
            <div className="whitespace-nowrap">
              <PrimaryButton
                withArrow={false}
                onClick={() => router.push(`/book?villa=${villa.id}`)}
              >
                BOOK VILLA
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
