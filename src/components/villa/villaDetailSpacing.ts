/**
 * Villa detail page — 8pt spatial system (mobile-first).
 *
 * Scale: 8 · 16 · 24 · 32 · 40 · 48 · 64
 * - Gutter: 16px → 24px (sm) → 32px (lg)
 * - Section padding: 40px top & bottom → 64px (lg) via .villa-section-pad-block
 * - In-section stacks: 32px between major blocks · 16px for tight groups
 */

export const VILLA_DETAIL_SPACING = {
  gutterX: "px-4 sm:px-6 lg:px-8",
  /**
   * Edge-bleed horizontal scroll tracks — left inset matches gutterX (pl + scroll-pl).
   * Use on Spaces category nav + image rails; do not combine with hScrollTrackMobileGutter.
   */
  hScrollTrackInset:
    "pl-4 sm:pl-6 lg:pl-8 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 scroll-pr-0",
  /** Symmetric block padding — see --villa-section-pad-block in globals.css */
  sectionY: "villa-section-pad-block",
  page: "max-w-7xl mx-auto w-full",
  content: "max-w-4xl mx-auto w-full",
  /** Equal vertical + horizontal section padding */
  sectionShell:
    "px-4 sm:px-6 lg:px-8 villa-section-pad-block max-w-7xl mx-auto w-full",
  stack: "flex flex-col gap-6",
  stackSm: "flex flex-col gap-4",
  stackTight: "flex flex-col gap-2",
  /**
   * Section 1 intro (detail + know-more overlays).
   * Rhythm: 12px eyebrow→title · 16px title→location · 24px location→stats · 32px stats→amenities · 32px amenities→body
   */
  introHeader: "flex flex-col gap-3",
  introEyebrow:
    "text-[#EFCD62] text-[10px] md:text-gh-label font-bold tracking-[0.2em] uppercase",
  introTitle:
    "text-[28px] md:text-[32px] font-philosopher text-white leading-tight m-0",
  introLocation:
    "group mt-4 flex w-fit max-w-full items-center gap-2 text-white/90 rounded-sm outline-none transition-colors hover:text-[#EFCD62] focus-visible:ring-2 focus-visible:ring-[#EFCD62]/60",
  introStats: "mt-6 w-full min-w-0",
  introStatsRow:
    "jade-hscroll-track flex flex-nowrap w-max max-w-full gap-x-4 items-center text-white/90 text-[10px] md:text-[12px] lg:text-[14px] font-normal font-manrope tracking-wide",
  introAmenity: "mt-8 w-full min-w-0",
  introBody: "mt-8 flex flex-col gap-6",
  introDescription:
    "font-manrope text-white/70 text-gh-body leading-relaxed whitespace-pre-line text-justify",
  introContent: "max-w-4xl mx-auto w-full",
  row: "flex flex-wrap gap-4",
  hScrollBleed: "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
  hScrollTrack: "flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-none",
  /** Stats chips row — stays inside page gutters (no viewport bleed). */
  statsTagsRail: "w-full min-w-0 overflow-x-auto scrollbar-none",
  /** Shared mobile: shell flush to device edges; track uses 16px inner gutter (see globals.css). */
  hScrollViewportEdge: "max-sm:jade-hscroll-viewport--edge",
  hScrollTrackMobileGutter: "max-sm:jade-hscroll-track--mobile-gutter",
  /**
   * Sticky category chrome — mobile full-bleed unchanged; sm+ max-w-7xl + page gutters.
   * Use with MeanderStrip layout="pageGutter" and stickyChromeShell on the tab bar.
   */
  stickyChromeShell:
    "w-full min-w-0 sm:max-w-7xl sm:mx-auto sm:px-4 md:px-6 lg:px-8",
  /**
   * Horizontal scroll rail — edge-to-edge on mobile; inset gutters at md+.
   * See `.amenity-highlight-*` in globals.css.
   */
  amenityHighlightViewportShell:
    "amenity-highlight-rail amenity-highlight-viewport w-full min-w-0",
  /** Mobile: viewport edge-to-edge; sm+: align with max-w-4xl column. */
  amenityHighlightViewportEdge:
    "max-sm:amenity-highlight-viewport--edge max-sm:jade-hscroll-viewport--edge",
  amenityHighlightViewportInset:
    "sm:amenity-highlight-viewport--content-inset",
  /** Villa detail amenity row — layout mode is container-driven, not viewport lg. */
  amenityHighlightTrackFullBleed:
    "amenity-highlight-track--responsive jade-hscroll-track max-sm:jade-hscroll-track--mobile-gutter scrollbar-none",
  /** Same row in experience overlays — right-edge scroll bleed + extra left inset on the track. */
  amenityHighlightTrackOverlay:
    "amenity-highlight-track--responsive jade-hscroll-track flex w-full min-w-0 gap-4 overflow-x-auto pb-8 mb-8 snap-x scrollbar-none scroll-pl-0 scroll-pr-4 sm:scroll-pr-6 md:scroll-pr-12 max-sm:-mr-4 max-sm:pr-4 sm:-mr-6 sm:pr-6 md:-mr-12 md:pr-12",
  /**
   * Overlay sticky category bar — same viewport + track contract as intro amenity highlights.
   * Edge bleed + 16px insets: globals.css `[data-experience-overlay-tabs]` (max-width 767px).
   */
  overlayCategoryRailViewport:
    "amenity-highlight-rail amenity-highlight-viewport w-full min-w-0",
  overlayCategoryRailTrack:
    "amenity-highlight-track--responsive jade-hscroll-track flex w-full min-w-0 gap-4 overflow-x-auto snap-x scrollbar-none overscroll-x-contain py-3 sm:py-4",
  /** Villa detail + venue overlay section titles (Spaces, Experiences, FAQ, etc.) */
  heading: "text-[32px] font-philosopher text-white leading-tight",
  /** Alias — section titles (Experiences, Spaces, FAQ, etc.) */
  sectionHeading: "text-[32px] font-philosopher text-white leading-tight",
  subheading: "text-[32px] font-philosopher text-white leading-tight",
  /** Carousel / image frame primary label (subordinate to sectionHeading) */
  mediaCaption:
    "text-white text-sm md:text-base uppercase tracking-[0.2em] font-bold font-manrope",
  /** Secondary line below mediaCaption */
  mediaDescription:
    "text-white/70 text-[13px] md:text-[15px] font-manrope leading-relaxed",
  eyebrow: "text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase",
  /** Pricing section legal note — fluid ~8px (see --fs-pricing-footnote) */
  pricingFootnote:
    "text-white/70 font-manrope text-gh-pricing-footnote leading-snug",
  heroInsetX: "px-4 sm:px-6 lg:px-8",
  heroBottom: "bottom-8 lg:bottom-12",
  /** Carousel arrows — align to page gutter (not flush to viewport) */
  heroArrowLeft: "left-4 sm:left-6 lg:left-8",
  heroArrowRight: "right-4 sm:right-6 lg:right-8",
} as const;

export const VILLA_DETAIL_CHARCOAL = "w-full bg-jade-charcoal text-white";
export const VILLA_DETAIL_GREEN = "w-full bg-jade-green text-white";
