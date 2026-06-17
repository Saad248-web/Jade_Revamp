/**
 * Scroll-linked horizontal panels — mobile / iOS layout contract.
 * Vars: scrollLinkedMobileViewport.ts + globals.css
 */

/** Legacy additive term in mobile offset formula (unchanged on mobile/tablet). */
export const SCROLL_LINKED_VISIBLE_GAP_MOBILE = 20;
export const SCROLL_LINKED_VISIBLE_GAP_MOBILE_WIDE = 56;

/**
 * Desktop/laptop: inter-card charcoal peek = legacy peek × this ratio.
 * 0.2 keeps 20% of the pre-fix gap (−80%).
 */
export const SCROLL_LINKED_DESKTOP_PEEK_RATIO = 0.2;

export type ScrollLinkedPanelGapVariant = "standard" | "wide";

export function resolveScrollLinkedLegacyGapAddon(
  variant: ScrollLinkedPanelGapVariant,
): number {
  return variant === "wide"
    ? SCROLL_LINKED_VISIBLE_GAP_MOBILE_WIDE
    : SCROLL_LINKED_VISIBLE_GAP_MOBILE;
}

/** @deprecated Desktop uses SCROLL_LINKED_DESKTOP_PEEK_RATIO on full peek, not this alone. */
export function resolveScrollLinkedVisibleGap(
  variant: ScrollLinkedPanelGapVariant,
  isDesktop: boolean,
): number {
  if (isDesktop) {
    return Math.round(
      resolveScrollLinkedLegacyGapAddon(variant) *
        SCROLL_LINKED_DESKTOP_PEEK_RATIO,
    );
  }
  return resolveScrollLinkedLegacyGapAddon(variant);
}

export const scrollLinkedStickyStageClass =
  "jade-scroll-linked-stage sticky overflow-hidden min-h-0 top-0 h-screen max-lg:h-[var(--jade-scroll-stage-mobile-height)] lg:top-0 lg:h-screen";

export const scrollLinkedStickyStageInnerClass =
  "flex h-full min-h-0 flex-col overflow-hidden isolation isolate";

export const scrollLinkedPanelAreaClass =
  "relative z-10 w-full min-h-0 flex-1 max-lg:max-h-[var(--jade-scroll-panel-row-height,100%)]";

/** Featured §6 — no section header; use full sticky stage height on mobile/tablet. */
export const scrollLinkedPanelAreaFeaturedClass =
  "relative z-10 w-full min-h-0 flex-1 max-lg:max-h-[var(--jade-scroll-stage-mobile-height,100%)]";

export const scrollLinkedSectionHeaderClass =
  "relative z-50 flex w-full shrink-0 flex-col items-center pointer-events-none max-lg:py-10 lg:py-[clamp(32px,4vh,51.2px)]";

export const scrollLinkedSectionHeaderTallClass =
  "relative z-50 flex w-full shrink-0 flex-col items-center pointer-events-none max-lg:py-[var(--jade-scroll-panel-gap,0.375rem)] lg:pt-[clamp(38.4px,4.8vh,64px)] lg:pb-8";

/**
 * Mobile: 1fr | card | 1fr grid — equal space above/below card in panel row.
 */
export const scrollLinkedPanelOuterClass =
  "relative mx-auto grid h-full min-h-0 w-full max-w-[1920px] max-lg:max-h-[var(--jade-scroll-panel-row-height,100%)] max-lg:grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] max-lg:items-center max-lg:justify-items-center max-lg:box-border max-lg:px-4 max-lg:pb-[var(--jade-scroll-panel-bottom-gap,1.25rem)] max-lg:py-0 sm:px-8 md:px-16 xl:px-24 lg:flex lg:flex-col lg:items-center lg:justify-center lg:pb-8";

export const scrollLinkedPanelOuterFeaturedClass =
  "relative mx-auto grid h-full min-h-0 w-full max-w-[1920px] max-lg:max-h-[var(--jade-scroll-stage-mobile-height,100%)] max-lg:grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] max-lg:items-center max-lg:justify-items-center max-lg:box-border max-lg:px-6 max-lg:pt-[var(--jade-mobile-chrome-top,3.5rem)] max-lg:pb-8 md:px-20 lg:px-32 xl:px-48 lg:flex lg:flex-col lg:items-center lg:justify-center lg:py-0";

export const scrollLinkedPanelStackWrapClass =
  "relative col-start-1 row-start-2 w-full max-w-md sm:max-w-lg md:max-w-2xl xl:max-w-4xl mx-auto self-center max-lg:max-h-full max-lg:pb-[max(0px,env(safe-area-inset-bottom,0px))]";

export const scrollLinkedPanelStackWrapFeaturedClass =
  "relative col-start-1 row-start-2 w-full max-w-md sm:max-w-lg md:max-w-2xl xl:max-w-4xl mx-auto self-center max-lg:max-h-full";

/** Mobile: height-first image; desktop keeps aspect ratio caps. */
const scrollLinkedPanelImageFrameMobileClass =
  "max-lg:h-[var(--jade-scroll-card-max-h)] max-lg:max-h-[var(--jade-scroll-card-max-h)] max-lg:min-h-[min(140px,32svh)] max-lg:aspect-auto max-lg:w-full";

const scrollLinkedFeaturedImageFrameMobileClass =
  "max-lg:h-[var(--jade-scroll-card-max-h-featured,var(--jade-scroll-card-max-h))] max-lg:max-h-[var(--jade-scroll-card-max-h-featured,var(--jade-scroll-card-max-h))] max-lg:min-h-[min(140px,32svh)] max-lg:aspect-auto max-lg:w-full";

export const scrollLinkedPanelImageFrameClass =
  `relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl aspect-[343/420] ${scrollLinkedPanelImageFrameMobileClass} sm:aspect-[4/3] md:aspect-[16/9] md:max-h-[clamp(240px,55dvh,600px)]`;

export const scrollLinkedPanelImageFrameTallHeaderClass =
  `relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl aspect-[343/420] max-lg:h-[var(--jade-scroll-card-max-h-tall-header)] max-lg:max-h-[var(--jade-scroll-card-max-h-tall-header)] max-lg:min-h-[min(140px,30svh)] max-lg:aspect-auto max-lg:w-full sm:aspect-[4/3] md:aspect-[16/9] md:max-h-[clamp(240px,55dvh,600px)]`;

export const scrollLinkedFeaturedVillaImageFrameClass =
  `relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl aspect-[343/420] ${scrollLinkedFeaturedImageFrameMobileClass} sm:aspect-[4/3] md:aspect-[21/10] lg:h-[48vh]`;

export const scrollLinkedPanelStackClass =
  "relative flex w-full max-h-full min-h-0 flex-col items-stretch max-lg:flex-1 max-lg:justify-center max-lg:gap-[var(--jade-scroll-panel-gap,0.5rem)] gap-2 lg:gap-4";

export const scrollLinkedPanelStackWideClass =
  "relative flex w-full max-h-full min-h-0 flex-col items-stretch max-lg:flex-1 max-lg:justify-center max-lg:gap-[var(--jade-scroll-panel-gap-lg,0.625rem)] gap-2 lg:gap-3";

export const scrollLinkedPanelStackFeaturedClass =
  "relative flex w-full max-h-full min-h-0 flex-col items-stretch max-lg:gap-[var(--jade-scroll-panel-gap-lg,0.625rem)] gap-2 lg:gap-3";

export const scrollLinkedPanelBodyClass =
  "font-manrope text-gh-body text-white/80 leading-relaxed shrink-0 max-lg:mb-[var(--jade-scroll-panel-gap,0.5rem)] max-lg:line-clamp-3 mb-2 lg:mb-4 lg:line-clamp-3 w-full";

export const scrollLinkedPanelTextBlockClass =
  "relative w-full flex flex-col items-stretch text-left shrink-0";

export const scrollLinkedPanelCtaClass =
  "inline-flex shrink-0 items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:gap-3 transition-all max-lg:pb-0.5";

export const scrollLinkedPanelSlideClass =
  "pointer-events-none absolute inset-0 flex h-full w-full lg:items-center lg:justify-center";

export const scrollLinkedPanelSlideInteractiveClass =
  "pointer-events-auto flex h-full w-full lg:items-center lg:justify-center";

/** Full-viewport slide shell — never captures clicks (pass through to cards below). */
export const scrollLinkedPanelSlideShellClass =
  "flex h-full w-full lg:items-center lg:justify-center pointer-events-none";

export const scrollLinkedIntroSlideClass =
  "pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 md:px-24";

/** @deprecated */
export const scrollLinkedPanelOuterPaddingClass = scrollLinkedPanelOuterClass;

/** @deprecated */
export const scrollLinkedPanelOuterPaddingFeaturedClass =
  scrollLinkedPanelOuterFeaturedClass;
