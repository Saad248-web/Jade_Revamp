/**
 * iOS Safari / mobile: one-time scroll-linked stage bootstrap.
 * Navbar + browser chrome are overlays — no live visualViewport tracking during scroll
 * (prevents body jerk when the header appears).
 */

const MOBILE_MQ = "(max-width: 1023px)";

/** Vars set once at bootstrap — cleared on desktop. */
const CUSTOM_PROPS = [
  "--jade-vv-offset-top",
  "--jade-vv-nav-inset",
  "--jade-mobile-chrome-bottom-px",
] as const;

export function isScrollLinkedMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MQ).matches;
}

/**
 * Pin scroll-linked sticky stage to static CSS tokens (globals.css).
 * Does not call Lenis.resize() or follow visualViewport while scrolling.
 */
export function bootstrapScrollLinkedMobileViewport(): void {
  if (!isScrollLinkedMobileViewport()) return;

  const root = document.documentElement;
  measureScrollLinkedChromeHeights();

  root.style.setProperty("--jade-vv-offset-top", "0px");
  root.style.setProperty("--jade-vv-nav-inset", "0px");
}

/** @deprecated No-op during scroll — use bootstrap on mount / orientation only. */
export function syncScrollLinkedMobileViewport(): void {
  bootstrapScrollLinkedMobileViewport();
}

/** Measure bottom chrome once — fixed navbar is transform-only overlay. */
export function measureScrollLinkedChromeHeights(): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const bottomEl = document.querySelector(".jade-scroll-chrome");

  if (bottomEl instanceof HTMLElement) {
    root.style.setProperty(
      "--jade-mobile-chrome-bottom-px",
      `${Math.ceil(bottomEl.getBoundingClientRect().height)}px`,
    );
  }
}

export function clearScrollLinkedMobileViewport(): void {
  const root = document.documentElement;
  for (const prop of CUSTOM_PROPS) {
    root.style.removeProperty(prop);
  }
}
