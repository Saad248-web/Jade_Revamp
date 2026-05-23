/** Shared Lenis + programmatic scroll tuning (luxury / silk feel). */

export type LenisScrollPreset = "extreme" | "balanced" | "default";

/** Legacy alias — same as extreme */
export type SmoothScrollPreset = LenisScrollPreset | "weddings";

/**
 * Wheel follow — lower = silkier trail, higher = tighter (less input lag).
 * `default` kept for fallback / reduced scope experiments.
 */
export const LENIS_LERP = 0.09;

/**
 * Site-wide premium silk — 0.042 balances glide + follow (0.03 feels stuck, not smooth).
 */
export const EXTREME_LENIS_LERP = 0.042;
export const EXTREME_LENIS_WHEEL_MULTIPLIER = 1;
export const EXTREME_LENIS_TOUCH_MULTIPLIER = 0.96;
export const EXTREME_LENIS_SYNC_TOUCH_LERP = 0.034;
export const EXTREME_LENIS_TOUCH_INERTIA_EXPONENT = 50;
export const EXTREME_LENIS_ANCHOR_DURATION = 2.1;
export const EXTREME_LENIS_SCROLL_TO_DURATION = 1.9;
export const EXTREME_LENIS_EASING = (t: number) => 1 - Math.pow(1 - t, 6);

/** `/book` — premium but tighter for forms and payment steps. */
export const BALANCED_LENIS_LERP = 0.07;
export const BALANCED_LENIS_WHEEL_MULTIPLIER = 0.92;
export const BALANCED_LENIS_TOUCH_MULTIPLIER = 0.94;
export const BALANCED_LENIS_SYNC_TOUCH_LERP = 0.06;
export const BALANCED_LENIS_ANCHOR_DURATION = 1.35;
export const BALANCED_LENIS_SCROLL_TO_DURATION = 1.35;
export const BALANCED_LENIS_EASING = (t: number) => 1 - Math.pow(1 - t, 5);

/** @deprecated Use EXTREME_LENIS_* */
export const WEDDINGS_LENIS_LERP = EXTREME_LENIS_LERP;
export const WEDDINGS_LENIS_WHEEL_MULTIPLIER = EXTREME_LENIS_WHEEL_MULTIPLIER;
export const WEDDINGS_LENIS_TOUCH_MULTIPLIER = EXTREME_LENIS_TOUCH_MULTIPLIER;
export const WEDDINGS_LENIS_SYNC_TOUCH_LERP = EXTREME_LENIS_SYNC_TOUCH_LERP;
export const WEDDINGS_LENIS_TOUCH_INERTIA_EXPONENT =
  EXTREME_LENIS_TOUCH_INERTIA_EXPONENT;
export const WEDDINGS_LENIS_ANCHOR_DURATION = EXTREME_LENIS_ANCHOR_DURATION;
export const WEDDINGS_LENIS_SCROLL_TO_DURATION = EXTREME_LENIS_SCROLL_TO_DURATION;
export const WEDDINGS_LENIS_EASING = EXTREME_LENIS_EASING;

export const LENIS_WHEEL_MULTIPLIER = 0.88;
export const LENIS_TOUCH_MULTIPLIER = 1;
export const LENIS_SYNC_TOUCH_LERP = 0.075;

export const LENIS_SCROLL_TO_DURATION = 1.35;
export const VILLA_DETAIL_SCROLL_TO_DURATION = 2;
export const LENIS_EASING = (t: number) => 1 - Math.pow(1 - t, 4);

export const PANEL_SMOOTH_SCROLL_MS = 920;
export const PANEL_SCROLL_EASING = (t: number) => 1 - Math.pow(1 - t, 4);
export const PANEL_LENIS_LERP = 0.06;
export const PANEL_LENIS_WHEEL_MULTIPLIER = 0.9;

export function lenisSyncTouchEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function normalizeLenisPreset(
  preset: SmoothScrollPreset | undefined,
): LenisScrollPreset {
  if (preset === "weddings" || preset === "extreme") return "extreme";
  if (preset === "balanced") return "balanced";
  return "default";
}

/** Route → preset when `SmoothScroll` has no explicit `preset` prop. */
export function getLenisPresetFromPathname(pathname: string): LenisScrollPreset {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/book" || path.startsWith("/book/")) return "balanced";
  return "extreme";
}

export function lenisSyncTouchEnabledForPreset(preset: LenisScrollPreset): boolean {
  if (preset === "extreme") return true;
  if (preset === "balanced") return lenisSyncTouchEnabled();
  return lenisSyncTouchEnabled();
}

export type LenisPresetConfig = {
  lerp: number;
  wheelMultiplier: number;
  touchMultiplier: number;
  syncTouchLerp: number;
  touchInertiaExponent?: number;
  anchorDuration: number;
  scrollToDuration: number;
  easing: (t: number) => number;
};

export function getLenisPresetConfig(preset: LenisScrollPreset): LenisPresetConfig {
  if (preset === "balanced") {
    return {
      lerp: BALANCED_LENIS_LERP,
      wheelMultiplier: BALANCED_LENIS_WHEEL_MULTIPLIER,
      touchMultiplier: BALANCED_LENIS_TOUCH_MULTIPLIER,
      syncTouchLerp: BALANCED_LENIS_SYNC_TOUCH_LERP,
      anchorDuration: BALANCED_LENIS_ANCHOR_DURATION,
      scrollToDuration: BALANCED_LENIS_SCROLL_TO_DURATION,
      easing: BALANCED_LENIS_EASING,
    };
  }
  if (preset === "extreme") {
    return {
      lerp: EXTREME_LENIS_LERP,
      wheelMultiplier: EXTREME_LENIS_WHEEL_MULTIPLIER,
      touchMultiplier: EXTREME_LENIS_TOUCH_MULTIPLIER,
      syncTouchLerp: EXTREME_LENIS_SYNC_TOUCH_LERP,
      touchInertiaExponent: EXTREME_LENIS_TOUCH_INERTIA_EXPONENT,
      anchorDuration: EXTREME_LENIS_ANCHOR_DURATION,
      scrollToDuration: EXTREME_LENIS_SCROLL_TO_DURATION,
      easing: EXTREME_LENIS_EASING,
    };
  }
  return {
    lerp: LENIS_LERP,
    wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
    touchMultiplier: LENIS_TOUCH_MULTIPLIER,
    syncTouchLerp: LENIS_SYNC_TOUCH_LERP,
    anchorDuration: 1.25,
    scrollToDuration: LENIS_SCROLL_TO_DURATION,
    easing: LENIS_EASING,
  };
}

/** @deprecated Use getLenisPresetFromPathname + getLenisPresetConfig */
export function isWeddingsRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return path === "/weddings";
}
