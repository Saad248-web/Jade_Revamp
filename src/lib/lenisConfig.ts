/** Shared Lenis + programmatic scroll tuning (luxury / silk feel). */

/**
 * Wheel follow — lower = silkier trail, higher = tighter (less input lag).
 * 0.09 balances cinematic ease with responsive feel on long pages.
 */
export const LENIS_LERP = 0.09;

export const LENIS_WHEEL_MULTIPLIER = 0.88;
export const LENIS_TOUCH_MULTIPLIER = 1;
export const LENIS_SYNC_TOUCH_LERP = 0.075;

/** Programmatic scroll-to-section (tabs, anchors, CTAs). */
export const LENIS_SCROLL_TO_DURATION = 1.35;

/** Villa detail — slower section jumps (View Villa / tab navigation). */
export const VILLA_DETAIL_SCROLL_TO_DURATION = 2;

/** easeOutQuart — soft landing without abrupt stop */
export const LENIS_EASING = (t: number) => 1 - Math.pow(1 - t, 4);

/** Inner panels (overlays, horizontal tab tracks) — ms — Tier 2 “extreme” programmatic */
export const PANEL_SMOOTH_SCROLL_MS = 920;

/** easeOutQuart for panel programmatic scroll */
export const PANEL_SCROLL_EASING = (t: number) => 1 - Math.pow(1 - t, 4);

/** Nested Lenis inside data-lenis-prevent vertical panels (overlays / menu) */
export const PANEL_LENIS_LERP = 0.06;
export const PANEL_LENIS_WHEEL_MULTIPLIER = 0.9;

/** Enable Lenis touch smoothing only on coarse pointers (saves desktop CPU). */
export function lenisSyncTouchEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
