"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import {
  EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS,
  EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS,
  EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_FRAME_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_SCROLL_SHEET_CLASS,
  EXPERIENCE_OVERLAY_STICKY_TABS_CLASS,
} from "@/lib/experienceOverlayTheme";
import {
  liquidCarouselBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";
import { stickyCategoryTabClass } from "@/lib/stickyTabGlass";

export type VillaExperienceCarouselImage = { name?: string; image: string };

export const EXPERIENCE_OVERLAY_MD_UP_QUERY = "(min-width: 768px)";

export function isExperienceOverlayMdUp(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(EXPERIENCE_OVERLAY_MD_UP_QUERY).matches;
}

/**
 * Below `md`: stuck frame + inner scroll sheet (close, hero, body).
 * At `md` and up: full-sheet scroll (unchanged).
 */
export function VillaExperienceOverlayBody({
  pinnedTop,
  children,
  mobileTopChrome,
  onScroll,
  scrollRef,
  onScrollRootUpdated,
}: {
  pinnedTop: React.ReactNode;
  children: React.ReactNode;
  /** Rendered inside the mobile scroll sheet (e.g. close button). */
  mobileTopChrome?: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.Ref<HTMLDivElement>;
  /** Fire after scroll root ref is synced (incl. breakpoint change) so observers can reconnect. */
  onScrollRootUpdated?: () => void;
}) {
  const scrollEl = useRef<HTMLDivElement>(null);
  const onScrollRootUpdatedRef = useRef(onScrollRootUpdated);
  onScrollRootUpdatedRef.current = onScrollRootUpdated;

  useLayoutEffect(() => {
    if (!scrollRef) return;
    const refObj = scrollRef as React.MutableRefObject<HTMLDivElement | null>;
    const sync = () => {
      refObj.current = scrollEl.current;
      onScrollRootUpdatedRef.current?.();
    };
    sync();
    const mq = window.matchMedia(EXPERIENCE_OVERLAY_MD_UP_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [scrollRef]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(e);
  };

  const scrollSheet = (
    <div
      ref={scrollEl}
      className={`${EXPERIENCE_OVERLAY_MOBILE_SCROLL_SHEET_CLASS} md:absolute md:inset-0 md:overflow-y-auto md:overscroll-y-contain md:scrollbar-none md:touch-pan-y`}
      onScroll={handleScroll}
    >
      {mobileTopChrome ? (
        <div className="relative z-[2] md:hidden shrink-0">{mobileTopChrome}</div>
      ) : null}
      <div className="relative z-[1]">{pinnedTop}</div>
      <div className={EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS}>{children}</div>
    </div>
  );

  return <div className={EXPERIENCE_OVERLAY_MOBILE_FRAME_CLASS}>{scrollSheet}</div>;
}

/** Close control: in-scroll on phone, fixed top-right at md+. */
export function VillaExperienceOverlayCloseFramer({
  MotionButton,
  onClose,
  isHidden = false,
  variant = "fixed",
}: {
  MotionButton: typeof motion.button;
  onClose: () => void;
  isHidden?: boolean;
  variant?: "in-sheet" | "fixed";
}) {
  const button = (
    <MotionButton
      initial={{ opacity: 0, scale: 0.9, y: 0 }}
      animate={{
        opacity: variant === "in-sheet" ? 1 : isHidden ? 0 : 1,
        scale: variant === "in-sheet" ? 1 : isHidden ? 0.8 : 1,
        y: variant === "in-sheet" ? 0 : isHidden ? -80 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={onClose}
      aria-label="Close"
      className={EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS}
    >
      <X className="w-6 h-6 stroke-[1.5]" />
    </MotionButton>
  );

  if (variant === "in-sheet") {
    return (
      <div className="flex justify-center pt-3 pb-2 w-12 h-12 mx-auto pointer-events-none">
        {button}
      </div>
    );
  }

  return (
    <div className="hidden md:block fixed top-6 right-6 z-[200] w-12 h-12 pointer-events-none">
      {button}
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
      className="relative w-full max-md:h-[clamp(200px,38dvh,340px)] md:h-[clamp(320px,65vh,720px)] overflow-hidden bg-black/20 group rounded-t-[32px] md:rounded-none"
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

      <CarouselSwipeLayer
        onPrev={onPrev}
        onNext={onNext}
        slideCount={images.length}
        className="absolute inset-0 z-[15] touch-pan-y"
      />

      {/* Bottom bar — same pattern as experience villa cards (arrows + label + index) */}
      {hasMultiple ? (
        <div className="absolute bottom-4 md:bottom-6 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <button
            type="button"
            aria-label="Previous image"
            onClick={onPrev}
            className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center border border-white/15 bg-transparent text-white backdrop-blur-2xl transition-all hover:border-white/35 hover:text-[#EFCD62]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center justify-center flex-1 min-w-0 px-1 pointer-events-auto">
            <span className="text-white font-manrope text-gh-label font-bold tracking-[0.25em] md:tracking-[0.3em] uppercase mb-2 text-center line-clamp-2">
              {slideLabel}
            </span>
            <div className="flex items-center gap-3">
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
            className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center border border-white/15 bg-transparent text-white backdrop-blur-2xl transition-all hover:border-white/35 hover:text-[#EFCD62]"
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
    <div className="mt-5 px-4 text-center">
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
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto py-4 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabClick(tab)}
                className={stickyCategoryTabClass(activeTab === tab)}
              >
                {tab}
              </button>
            ))}
          </div>
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
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-3 px-4 md:px-12">
        <div className="flex flex-col font-manrope leading-tight">
          <span className="text-white/60 text-[11px] sm:text-[12px] md:text-[13px] font-bold whitespace-nowrap">
            Starting from
          </span>
          <span className="text-white text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-extrabold whitespace-nowrap">
            {priceMain}
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
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
