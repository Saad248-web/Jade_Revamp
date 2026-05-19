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
  heading: "text-gh-h1 font-philosopher text-white",
  subheading: "text-gh-h2 font-philosopher text-white",
  eyebrow: "text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase",
  heroInsetX: "px-4 sm:px-6 lg:px-8",
  heroBottom: "bottom-8 lg:bottom-12",
  /** Carousel arrows — align to page gutter (not flush to viewport) */
  heroArrowLeft: "left-4 sm:left-6 lg:left-8",
  heroArrowRight: "right-4 sm:right-6 lg:right-8",
} as const;

export const VILLA_DETAIL_CHARCOAL = "w-full bg-jade-charcoal text-white";
export const VILLA_DETAIL_GREEN = "w-full bg-jade-green text-white";
