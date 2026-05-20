/**
 * Villa detail page — 8pt spatial system (mobile-first).
 *
 * Scale: 8 · 16 · 24 · 32 · 48 · 64
 * - Gutter: 16px → 24px (sm) → 32px (lg)
 * - Section padding: 48px top & bottom → 64px (lg)
 * - In-section stacks: 32px between major blocks · 16px for tight groups
 */

export const VILLA_DETAIL_SPACING = {
  gutterX: "px-3 sm:px-5 lg:px-6",
  sectionY: "py-10 lg:py-12",
  page: "max-w-7xl mx-auto w-full",
  content: "max-w-4xl mx-auto w-full",
  /** Equal vertical + horizontal section padding */
  sectionShell: "px-3 sm:px-5 lg:px-6 py-10 lg:py-12 max-w-7xl mx-auto w-full",
  stack: "flex flex-col gap-6",
  stackSm: "flex flex-col gap-3",
  stackTight: "flex flex-col gap-2",
  row: "flex flex-wrap gap-3",
  hScrollBleed: "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
  hScrollTrack: "flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-none",
  /**
   * Escapes `max-w-4xl` so the amenity strip spans the full viewport width (edge-to-edge),
   * while tiles stay aligned with body copy (see nested rails + `amenityHighlightTrackFullBleed`).
   */
  amenityHighlightViewportShell:
    "relative w-screen max-w-[100vw] shrink-0 left-1/2 -translate-x-1/2",
  /** Matches `sectionShell` horizontal chrome — pairs with `amenityHighlightRailContent`. */
  amenityHighlightRailAlign:
    "max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-5 lg:px-6",
  /** Same as `content` — reference width for `50%` in the full-bleed track padding calc. */
  amenityHighlightRailContent: "max-w-4xl mx-auto w-full min-w-0",
  /**
   * Full-bleed horizontal track centered on the 4xl column: `pl` lands on the same axis as
   * title/stats/description on all breakpoints; `gap-3` keeps tile rhythm fixed.
   */
  amenityHighlightTrackFullBleed:
    "flex min-w-0 gap-3 overflow-x-auto pb-2 snap-x scrollbar-none w-screen relative left-1/2 -translate-x-1/2 pl-[max(0.75rem,calc(50vw-50%))] pr-3 sm:pr-5 lg:pr-6 scroll-pl-[max(0.75rem,calc(50vw-50%))] scroll-pr-3 sm:scroll-pr-5 lg:scroll-pr-6",
  /** Same row in experience overlays — right-edge scroll bleed + extra left inset on the track. */
  amenityHighlightTrackOverlay:
    "flex w-full min-w-0 gap-3 overflow-x-auto pb-5 mb-10 snap-x scrollbar-none scroll-pl-0 scroll-pr-6 md:scroll-pr-12 -mr-6 pr-6 md:-mr-12 md:pr-12",
  heading: "text-gh-h1 font-philosopher text-white leading-tight",
  /** Alias — section titles (Experiences, Spaces, FAQ, etc.) */
  sectionHeading: "text-gh-h1 font-philosopher text-white leading-tight",
  subheading: "text-gh-h2 font-philosopher text-white",
  /** Carousel / image frame primary label (subordinate to sectionHeading) */
  mediaCaption:
    "text-white text-sm md:text-base uppercase tracking-[0.2em] font-bold font-manrope",
  /** Secondary line below mediaCaption */
  mediaDescription:
    "text-white/70 text-[13px] md:text-[15px] font-manrope leading-relaxed",
  eyebrow: "text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase",
  heroInsetX: "px-4 sm:px-6 lg:px-8",
  heroBottom: "bottom-8 lg:bottom-12",
  /** Carousel arrows — align to page gutter (not flush to viewport) */
  heroArrowLeft: "left-4 sm:left-6 lg:left-8",
  heroArrowRight: "right-4 sm:right-6 lg:right-8",
} as const;

export const VILLA_DETAIL_CHARCOAL = "w-full bg-jade-charcoal text-white";
export const VILLA_DETAIL_GREEN = "w-full bg-jade-green text-white";
