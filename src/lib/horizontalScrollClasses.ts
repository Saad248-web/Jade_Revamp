/**
 * Single contract for touch-scrollable horizontal rails on mobile.
 * Use on the scroll root (the element with overflow-x-auto), or prefer HorizontalScrollRail.
 */
export const HORIZONTAL_SCROLL_TRACK_CLASSES =
  "jade-hscroll-track flex overflow-x-auto min-w-0 overscroll-x-contain scrollbar-none";

/** Marks a node for Lenis + global mobile touch rules (see globals.css). */
export const JADE_HSCROLL_DATA_ATTR = "data-jade-hscroll" as const;

/**
 * Horizontal-only rails: block Lenis touch capture, NOT wheel — so vertical page
 * scroll continues when the cursor hovers the blog / tab / amenity row.
 */
export const JADE_LENIS_PREVENT_TOUCH = "data-lenis-prevent-touch" as const;
