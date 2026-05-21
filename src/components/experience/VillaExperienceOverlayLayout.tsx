"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import {
  EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS,
  EXPERIENCE_OVERLAY_BOTTOM_BAR_SHEET_CLASS,
  EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS,
  EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS,
  EXPERIENCE_OVERLAY_DESKTOP_BODY_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_HOST_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_SCROLL_SHEET_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_SHEET_FRAME_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_SHEET_SCRIM_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_SHEET_ZONE_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_TOP_SHADE_CLASS,
  EXPERIENCE_OVERLAY_MOBILE_TOP_SHADE_VH,
  EXPERIENCE_OVERLAY_STICKY_TABS_CLASS,
} from "@/lib/experienceOverlayTheme";
import {
  liquidCarouselBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";
import { stickyCategoryTabClass } from "@/lib/stickyTabGlass";
import { useScrollTabIntoView } from "@/lib/useScrollTabIntoView";

export type VillaExperienceCarouselImage = { name?: string; image: string };

export const EXPERIENCE_OVERLAY_MD_UP_QUERY = "(min-width: 768px)";

export function isExperienceOverlayMdUp(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(EXPERIENCE_OVERLAY_MD_UP_QUERY).matches;
}

/**
 * Below `md`: top shade + stuck rounded sheet; inner scroll clips at top radius.
 * At `md` and up: full-sheet scroll (unchanged).
 */
export function VillaExperienceOverlayBody({
  pinnedTop,
  children,
  mobileFooter,
  onScroll,
  scrollRef,
  onScrollRootUpdated,
  onBackdropClick,
}: {
  pinnedTop: React.ReactNode;
  children: React.ReactNode;
  /** Pinned to bottom of mobile sheet (booking bar). */
  mobileFooter?: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.Ref<HTMLDivElement>;
  onScrollRootUpdated?: () => void;
  /** Tap top shade to dismiss (mobile). */
  onBackdropClick?: () => void;
}) {
  const mobileScrollEl = useRef<HTMLDivElement>(null);
  const desktopScrollEl = useRef<HTMLDivElement>(null);
  const onScrollRootUpdatedRef = useRef(onScrollRootUpdated);
  onScrollRootUpdatedRef.current = onScrollRootUpdated;

  useLayoutEffect(() => {
    if (!scrollRef) return;
    const refObj = scrollRef as React.MutableRefObject<HTMLDivElement | null>;
    const sync = () => {
      refObj.current = isExperienceOverlayMdUp()
        ? desktopScrollEl.current
        : mobileScrollEl.current;
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

  const scrollContent = (
    <>
      <div className="relative z-[1]">{pinnedTop}</div>
      <div className={EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS}>{children}</div>
    </>
  );

  return (
    <>
      {/* Mobile: top shade + stuck sheet */}
      <div className={EXPERIENCE_OVERLAY_MOBILE_HOST_CLASS}>
        <button
          type="button"
          className={`${EXPERIENCE_OVERLAY_MOBILE_TOP_SHADE_CLASS} w-full border-0 p-0 cursor-pointer relative z-20`}
          aria-label="Close overlay"
          onClick={onBackdropClick}
        />
        <div className={EXPERIENCE_OVERLAY_MOBILE_SHEET_ZONE_CLASS}>
          <div className={EXPERIENCE_OVERLAY_MOBILE_SHEET_SCRIM_CLASS} aria-hidden />
          <div className={EXPERIENCE_OVERLAY_MOBILE_SHEET_FRAME_CLASS}>
            <div
              ref={mobileScrollEl}
              className={EXPERIENCE_OVERLAY_MOBILE_SCROLL_SHEET_CLASS}
              data-lenis-prevent
              onScroll={handleScroll}
            >
              {scrollContent}
            </div>
            {mobileFooter ? (
              <div className="shrink-0 relative">{mobileFooter}</div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Desktop: full viewport scroll */}
      <div
        ref={desktopScrollEl}
        className={EXPERIENCE_OVERLAY_DESKTOP_BODY_CLASS}
        data-lenis-prevent
        onScroll={handleScroll}
      >
        {scrollContent}
      </div>
    </>
  );
}

/** Close: above sheet on phone; fixed top-right at md+. */
export function VillaExperienceOverlayCloseFramer({
  MotionButton,
  onClose,
  isHidden = false,
  variant = "fixed",
}: {
  MotionButton: typeof motion.button;
  onClose: () => void;
  isHidden?: boolean;
  variant?: "above-sheet" | "fixed";
}) {
  const button = (
    <MotionButton
      initial={{ opacity: 0, scale: 0.9, y: 0 }}
      animate={{
        opacity: variant === "above-sheet" ? 1 : isHidden ? 0 : 1,
        scale: variant === "above-sheet" ? 1 : isHidden ? 0.8 : 1,
        y: variant === "above-sheet" ? 0 : isHidden ? -80 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={onClose}
      aria-label="Close"
      className={EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS}
    >
      <X className="w-6 h-6 stroke-[1.5]" />
    </MotionButton>
  );

  if (variant === "above-sheet") {
    return (
      <div
        className="md:hidden fixed left-1/2 -translate-x-1/2 z-[210] w-12 h-12 pointer-events-none"
        style={{ top: `calc(${EXPERIENCE_OVERLAY_MOBILE_TOP_SHADE_VH}vh - 3.25rem)` }}
      >
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
      className="relative w-full max-md:h-[clamp(200px,32dvh,300px)] md:h-[clamp(320px,65vh,720px)] overflow-hidden bg-black/20 group max-md:rounded-none md:rounded-none"
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
  const trackRef = useScrollTabIntoView(activeTab);

  return (
    <div className={EXPERIENCE_OVERLAY_STICKY_TABS_CLASS}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full">
          <div
            ref={trackRef}
            className="jade-hscroll-track flex gap-2 sm:gap-3 overflow-x-auto py-4 scrollbar-none overscroll-x-contain"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                data-tab-key={tab}
                onClick={() => onTabClick(tab)}
                className={stickyCategoryTabClass(activeTab === tab)}
                aria-current={activeTab === tab ? "true" : undefined}
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
  placement = "viewport",
}: {
  villaId: string;
  onwardPrice: string | null | undefined;
  onEnquireClick: () => void;
  placement?: "viewport" | "sheet";
}) {
  const priceMain = onwardPrice?.trim() || "Enquire";
  const barClass =
    placement === "sheet"
      ? EXPERIENCE_OVERLAY_BOTTOM_BAR_SHEET_CLASS
      : EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS;
  return (
    <div className={barClass}>
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
