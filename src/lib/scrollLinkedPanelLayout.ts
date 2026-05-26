/**
 * Scroll-linked horizontal panels — mobile / iOS layout contract.
 *
 * Model (max-lg):
 * - Sticky stage height = 100dvh − navbar − MobileBottomNav (CSS vars in globals.css)
 * - Section label = compact row above panel area
 * - Panel row (flex-1): card vertically centered → equal space above/below card
 * - Portrait image height from --jade-scroll-card-max-h (no landscape squash)
 */

export const scrollLinkedStickyStageClass =
  "jade-scroll-linked-stage sticky top-0 h-screen overflow-hidden min-h-0 max-lg:top-[var(--jade-mobile-chrome-top)] max-lg:h-[var(--jade-scroll-stage-mobile-height)] lg:top-0 lg:h-screen";

export const scrollLinkedStickyStageInnerClass =
  "flex h-full min-h-0 flex-col overflow-hidden isolation isolate";

/** Remaining height below section label — slides are position:absolute fill. */
export const scrollLinkedPanelAreaClass =
  "relative z-10 w-full min-h-0 flex-1";

/** Section label (WAYS JADE / etc.) — one tight row; does not participate in card centering. */
export const scrollLinkedSectionHeaderClass =
  "relative z-50 flex w-full shrink-0 flex-col items-center pointer-events-none max-lg:py-2 lg:pt-[clamp(32px,4vh,51.2px)] lg:pb-[clamp(4px,0.8vh,9.6px)]";

export const scrollLinkedSectionHeaderTallClass =
  "relative z-50 flex w-full shrink-0 flex-col items-center pointer-events-none max-lg:py-2 lg:pt-[clamp(38.4px,4.8vh,64px)] lg:pb-8";

/**
 * Slide shell — centers card in panel row (equal slack above/below card).
 */
export const scrollLinkedPanelOuterClass =
  "relative mx-auto flex h-full min-h-0 w-full max-w-[1920px] flex-col items-center justify-center max-lg:box-border max-lg:px-4 max-lg:py-1 sm:px-8 md:px-16 xl:px-24 lg:pb-8";

export const scrollLinkedPanelOuterFeaturedClass =
  "relative mx-auto flex h-full min-h-0 w-full max-w-[1920px] flex-col items-center justify-center max-lg:box-border max-lg:px-6 max-lg:py-1 md:px-20 lg:px-32 xl:px-48 sm:py-0 lg:pb-0";

export const scrollLinkedPanelStackWrapClass =
  "relative w-full max-w-md sm:max-w-lg md:max-w-2xl xl:max-w-4xl mx-auto";

export const scrollLinkedPanelStackClass =
  "relative flex w-full flex-col items-stretch gap-2 max-lg:gap-2.5 lg:gap-4";

export const scrollLinkedPanelStackWideClass =
  "relative flex w-full flex-col items-stretch gap-2 max-lg:gap-3 lg:gap-5";

/** Portrait frame — mobile uses stage-aware max-height (iOS dvh-safe). */
export const scrollLinkedPanelImageFrameClass =
  "relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl aspect-[343/420] max-lg:max-h-[var(--jade-scroll-card-max-h)] max-lg:min-h-[200px] sm:aspect-[4/3] md:aspect-[16/9] md:max-h-[clamp(240px,55dvh,600px)]";

export const scrollLinkedPanelImageFrameTallHeaderClass =
  "relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl aspect-[343/420] max-lg:max-h-[var(--jade-scroll-card-max-h-tall-header)] max-lg:min-h-[180px] sm:aspect-[4/3] md:aspect-[16/9] md:max-h-[clamp(240px,55dvh,600px)]";

export const scrollLinkedFeaturedVillaImageFrameClass =
  "relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl aspect-[343/420] max-lg:max-h-[var(--jade-scroll-card-max-h)] max-lg:min-h-[200px] sm:aspect-[4/3] md:aspect-[21/10] lg:h-[48vh]";

export const scrollLinkedPanelBodyClass =
  "font-manrope text-gh-body text-white/80 leading-relaxed mb-2.5 max-lg:mb-3 max-lg:line-clamp-none lg:mb-4 lg:line-clamp-3 max-w-lg";

export const scrollLinkedPanelSlideClass =
  "pointer-events-none absolute inset-0 flex h-full w-full lg:items-center lg:justify-center";

export const scrollLinkedPanelSlideInteractiveClass =
  "pointer-events-auto flex h-full w-full lg:items-center lg:justify-center";

/** Intro slide (Featured villas title) — full-panel center, unchanged on desktop. */
export const scrollLinkedIntroSlideClass =
  "pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 md:px-24";

/** @deprecated */
export const scrollLinkedPanelOuterPaddingClass = scrollLinkedPanelOuterClass;

/** @deprecated */
export const scrollLinkedPanelOuterPaddingFeaturedClass =
  scrollLinkedPanelOuterFeaturedClass;
