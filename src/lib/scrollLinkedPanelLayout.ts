/**
 * Scroll-linked horizontal panel sections — shared class bundles.
 * Mobile: safe stage height (excludes bottom nav); card uses 1fr/auto/1fr grid
 * so space above the card equals space below (heading stays in its own row).
 */

export const scrollLinkedStickyStageClass =
  "sticky overflow-hidden min-h-0 top-0 h-screen max-lg:top-[var(--jade-mobile-chrome-top)] max-lg:h-[var(--jade-scroll-stage-mobile-height)] lg:top-0 lg:h-screen";

export const scrollLinkedStickyStageInnerClass =
  "flex h-full min-h-0 flex-col overflow-hidden isolation isolate";

export const scrollLinkedPanelAreaClass =
  "relative z-10 w-full min-h-0 flex-1";

export const scrollLinkedSectionHeaderClass =
  "relative w-full z-50 flex flex-col items-center pointer-events-none shrink-0 max-lg:py-2 lg:pt-[clamp(32px,4vh,51.2px)] lg:pb-[clamp(4px,0.8vh,9.6px)]";

export const scrollLinkedSectionHeaderTallClass =
  "relative w-full z-50 flex flex-col items-center pointer-events-none shrink-0 max-lg:py-2 lg:pt-[clamp(38.4px,4.8vh,64px)] lg:pb-8";

/**
 * Slide shell — mobile: equal flex bands above/below card (not center in whole panel).
 */
export const scrollLinkedPanelOuterClass =
  "relative h-full min-h-0 w-full max-w-[1920px] mx-auto max-lg:grid max-lg:min-h-full max-lg:grid-rows-[1fr_auto_1fr] max-lg:items-stretch max-lg:px-4 max-lg:py-0 sm:px-8 md:px-16 xl:px-24 lg:flex lg:flex-col lg:items-center lg:justify-center lg:pb-8";

export const scrollLinkedPanelOuterFeaturedClass =
  "relative h-full min-h-0 w-full max-w-[1920px] mx-auto max-lg:grid max-lg:min-h-full max-lg:grid-rows-[1fr_auto_1fr] max-lg:items-stretch max-lg:px-6 max-lg:py-0 md:px-20 lg:px-32 xl:px-48 sm:py-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:pb-0";

/** Card column — sits in the middle grid row on mobile. */
export const scrollLinkedPanelStackWrapClass =
  "relative col-start-1 row-start-2 w-full max-w-md sm:max-w-lg md:max-w-2xl xl:max-w-4xl mx-auto self-center";

export const scrollLinkedPanelStackClass =
  "relative flex w-full flex-col items-stretch gap-2.5 lg:gap-4";

export const scrollLinkedPanelStackWideClass =
  "relative flex w-full flex-col items-stretch gap-3 lg:gap-5";

/** Portrait on mobile only; wider aspects from sm+ / md+. */
export const scrollLinkedPanelImageFrameClass =
  "relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl max-lg:aspect-[343/420] max-lg:max-h-[clamp(240px,55dvh,600px)] max-lg:w-full sm:aspect-[4/3] md:aspect-[16/9] md:max-h-[clamp(240px,55dvh,600px)]";

export const scrollLinkedFeaturedVillaImageFrameClass =
  "relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl max-lg:aspect-[343/420] max-lg:w-full sm:aspect-[4/3] md:aspect-[21/10] lg:h-[48vh]";

/** Absolute slide — stretch on mobile so the grid can use full panel height. */
export const scrollLinkedPanelSlideClass =
  "pointer-events-none absolute inset-0 flex h-full w-full max-lg:items-stretch max-lg:justify-stretch lg:items-center lg:justify-center";

export const scrollLinkedPanelSlideInteractiveClass =
  "pointer-events-auto flex h-full w-full max-lg:items-stretch max-lg:justify-stretch lg:items-center lg:justify-center";

/** @deprecated */
export const scrollLinkedPanelOuterPaddingClass = scrollLinkedPanelOuterClass;

/** @deprecated */
export const scrollLinkedPanelOuterPaddingFeaturedClass =
  scrollLinkedPanelOuterFeaturedClass;
