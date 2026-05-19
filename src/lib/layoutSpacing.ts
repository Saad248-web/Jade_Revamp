/** External layout rhythm scale (~20% tighter). Do not use for control internal padding. */
export const LAYOUT_SPACE_SCALE = 0.8;

export function spaceClamp(minPx: number, mid: string, maxPx: number): string {
  const s = LAYOUT_SPACE_SCALE;
  return `clamp(${minPx * s}px, ${mid}, ${maxPx * s}px)`;
}

/** Fluid spacing clamp strings (sync with tailwind.config.ts + globals.css). */
export const FLUID_SPACE = {
  xs: "clamp(3.2px, 0.4vw, 6.4px)",
  sm: "clamp(6.4px, 0.8vw, 12.8px)",
  md: "clamp(12.8px, 1.6vw, 25.6px)",
  lg: "clamp(25.6px, 3.2vw, 51.2px)",
  xl: "clamp(38.4px, 4.8vw, 76.8px)",
  "2xl": "clamp(51.2px, 6.4vw, 102.4px)",
} as const;

/**
 * Footer bottom padding when a fixed booking bar sits over the page (villa detail, etc.).
 * ~5.75rem clears py-4 bar + PrimaryButton + safe-area on desktop (lg:pb-12 was too short).
 */
export const STICKY_BOOKING_BAR_FOOTER_PAD_CLASS =
  "pb-[max(5.75rem,calc(5.75rem+env(safe-area-inset-bottom,0px)))]";
