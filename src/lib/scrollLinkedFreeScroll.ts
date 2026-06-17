/** Manual horizontal navigation tuning for scroll-linked sticky sections. */

/** Desktop / fine pointer — grab drag */
export const SCROLL_LINKED_DRAG_FACTOR = 1.5;

/** Mobile / coarse pointer — amplified for finger swipes */
export const SCROLL_LINKED_MOBILE_DRAG_FACTOR = 2.75;

/** Wheel / two-finger trackpad */
export const SCROLL_LINKED_WHEEL_FACTOR = 1.65;

/** Pinned section height (vh) — less vertical travel = faster horizontal on mobile */
export const SCROLL_LINKED_SECTION_VH = {
  home: { mobile: 360, desktop: 560 },
  experiences: { mobile: 360, desktop: 560 },
  wedding: { mobile: 300, desktop: 440 },
} as const;
