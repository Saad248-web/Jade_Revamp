"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import {
  EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS,
  EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS,
  EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS,
  EXPERIENCE_OVERLAY_STICKY_TABS_CLASS,
} from "@/lib/experienceOverlayTheme";
import {
  liquidCarouselBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";

export type VillaExperienceCarouselImage = { name?: string; image: string };

export function VillaExperienceOverlayContentFrame({
  children,
  onScroll,
}: {
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}) {
  return (
    <div 
      className="absolute inset-0 overflow-y-auto scrollbar-none"
      onScroll={onScroll}
    >
      <div className={EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS}>
        {children}
      </div>
    </div>
  );
}

export function VillaExperienceOverlayCloseFramer({
  MotionButton,
  onClose,
  isHidden = false,
}: {
  MotionButton: typeof motion.button;
  onClose: () => void;
  isHidden?: boolean;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:top-6 md:left-auto md:right-6 md:translate-x-0 z-[200] w-12 h-12 pointer-events-none">
      <MotionButton
        initial={{ opacity: 0, scale: 0.9, y: 0 }}
        animate={{ 
          opacity: isHidden ? 0 : 1, 
          scale: isHidden ? 0.8 : 1,
          y: isHidden ? -80 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={onClose}
        aria-label="Close"
        className={EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS}
      >
        <X className="w-6 h-6 stroke-[1.5]" />
      </MotionButton>
    </div>
  );
}

export function VillaExperienceHeroCarousel({
  images,
  currentImageIndex,
  carouselCustom,
  onPrev,
  onNext,
  fallbackSlideLabel = "SPACE",
}: {
  images: VillaExperienceCarouselImage[];
  currentImageIndex: number;
  carouselCustom: HeroSplitCustom;
  onPrev: () => void;
  onNext: () => void;
  /** When slide has no name — default matches wedding/weekend/party cards */
  fallbackSlideLabel?: string;
}) {
  const MotionDiv = motion.div;
  const slide = images[currentImageIndex];
  const slideLabel = slide?.name?.trim() || fallbackSlideLabel;
  const hasMultiple = images.length > 1;

  return (
    <div
      className="relative w-full h-[clamp(320px,65vh,720px)] overflow-hidden bg-black/20 group rounded-t-[32px] md:rounded-none"
      style={{ perspective: "1500px" }}
    >
      <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
        <MotionDiv
          key={currentImageIndex}
          custom={carouselCustom}
          variants={liquidCarouselBgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src={slide.image}
            alt={slide.name || "Venue"}
            fill
            className="object-cover"
          />
          {/* Match WeddingVillaCard / VillaCard: stronger base for bottom controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </MotionDiv>
      </AnimatePresence>

      {/* Bottom bar — same pattern as experience villa cards (arrows + label + index) */}
      {hasMultiple ? (
        <div className="absolute bottom-4 md:bottom-6 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <button
            type="button"
            aria-label="Previous image"
            onClick={onPrev}
            className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-[#EFCD62] hover:text-black transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center justify-center flex-1 min-w-0 px-1 pointer-events-auto">
            <span className="text-white font-manrope text-gh-label font-bold tracking-[0.25em] md:tracking-[0.3em] uppercase mb-2 text-center line-clamp-2">
              {slideLabel}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-white font-philosopher text-gh-gallery-pagination tabular-nums leading-none">
                {currentImageIndex + 1}
              </span>
              <div className="w-12 h-[1px] bg-white/40 shrink-0" />
              <span className="text-white/60 font-philosopher text-gh-gallery-pagination tabular-nums leading-none">
                {images.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Next image"
            onClick={onNext}
            className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-[#EFCD62] hover:text-black transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="absolute bottom-4 md:bottom-6 left-4 right-4 z-20 flex flex-col items-center pointer-events-none">
          <span className="pointer-events-none text-white font-manrope text-gh-label font-bold tracking-[0.25em] md:tracking-[0.3em] uppercase mb-2 text-center line-clamp-2">
            {slideLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export function VillaExperienceGalleryCaption({ label }: { label: string }) {
  return (
    <div className="mt-6 px-4 text-center">
      <span className="text-white/50 font-manrope text-gh-label font-bold tracking-[0.12em]">
        {label}
      </span>
    </div>
  );
}

export function VillaExperienceStickyTabs({
  tabs,
  activeTab,
  onTabClick,
}: {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}) {
  return (
    <div className={EXPERIENCE_OVERLAY_STICKY_TABS_CLASS}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto py-4 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabClick(tab)}
              className={`shrink-0 px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold font-manrope transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-jade-gold text-black"
                  : "text-white/80 hover:text-white bg-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VillaExperienceBookingBottomBar({
  villaId,
  onwardPrice,
  onEnquireClick,
}: {
  villaId: string;
  onwardPrice: string | null | undefined;
  onEnquireClick: () => void;
}) {
  const priceMain = onwardPrice?.trim() || "Enquire";
  return (
    <div className={EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS}>
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-4 px-4 md:px-12">
        <div className="flex flex-col font-manrope leading-tight">
          <span className="text-white/60 text-[11px] sm:text-[12px] md:text-[13px] font-bold whitespace-nowrap">
            Starting from
          </span>
          <span className="text-white text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-extrabold whitespace-nowrap">
            {priceMain}
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={onEnquireClick}
            className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase hover:text-white transition-colors whitespace-nowrap"
          >
            ENQUIRE
          </button>
          <PrimaryButton
            href={`/book?villa=${villaId}`}
            withArrow={false}
            className="whitespace-nowrap"
          >
            BOOK VILLA
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
