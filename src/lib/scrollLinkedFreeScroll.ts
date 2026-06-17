/** Manual horizontal navigation tuning for scroll-linked sticky sections. */

/**
 * Grab / swipe: ~1:1 mapping — finger/cursor drift maps directly to scroll (free feel).
 * Slightly above 1.0 on mobile only for balanced responsiveness without stickiness.
 */
export const SCROLL_LINKED_DRAG_FACTOR = 1.0;
export const SCROLL_LINKED_MOBILE_DRAG_FACTOR = 1.15;

/** Wheel / two-finger trackpad — modest boost, same direction as swipe-left = forward */
export const SCROLL_LINKED_WHEEL_FACTOR = 1.2;

/**
 * Pinned section height (vh). Taller = more vertical runway = freer horizontal drift.
 * Mobile slightly shorter than desktop for a touch of extra responsiveness.
 */
export const SCROLL_LINKED_SECTION_VH = {
  home: { mobile: 500, desktop: 560 },
  experiences: { mobile: 500, desktop: 560 },
  wedding: { mobile: 420, desktop: 440 },
} as const;
