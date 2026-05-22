/**
 * Framer motion for scroll-driven chrome hide.
 * Overlay close: `VillaExperienceOverlayCloseFramer` (variant `fixed`).
 */

export const SCROLL_CHROME_FRAMER_TRANSITION = {
  duration: 0.3,
  ease: "easeInOut" as const,
};

/** Global navbar — fast slide reflex, no fade lag. */
export const NAVBAR_SCROLL_CHROME_TRANSITION = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1] as const,
};

export function navbarScrollChromeAnimate(isHidden: boolean) {
  return {
    y: isHidden ? "-100%" : "0%",
  };
}

export const SCROLL_CHROME_FRAMER_INITIAL = {
  opacity: 0,
  scale: 0.9,
  y: 0,
};

/** Desktop overlay close uses y: -80 (48px button). Pass yHidden for taller chrome (e.g. navbar). */
export function scrollChromeAnimate(
  isHidden: boolean,
  options?: { yHidden?: number | string },
) {
  const yHidden = options?.yHidden ?? -80;
  return {
    opacity: isHidden ? 0 : 1,
    scale: isHidden ? 0.8 : 1,
    y: isHidden ? yHidden : 0,
  };
}
