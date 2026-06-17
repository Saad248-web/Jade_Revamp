/**
 * iOS Safari / mobile: sync scroll-linked panel stage to visualViewport so layout
 * does not break when browser chrome or the site navbar show/hide on scroll.
 */

import { getLenis } from "@/lib/lenis";

const MOBILE_MQ = "(max-width: 1023px)";

/** Runtime-synced vars only — card frame, gaps, and offsets use static CSS tokens. */
const CUSTOM_PROPS = [
  "--jade-vv-offset-top",
  "--jade-vv-height",
  "--jade-vv-nav-inset",
  "--jade-scroll-stage-mobile-height",
  "--jade-mobile-chrome-top-px",
  "--jade-mobile-chrome-bottom-px",
] as const;

function parsePx(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function readRootPx(varName: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return parsePx(raw) || fallback;
}

export function isScrollLinkedMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MQ).matches;
}

/** Extra bottom inset when iOS browser toolbar overlaps layout viewport. */
function readBrowserToolbarBottomInset(
  vv: VisualViewport,
  layoutH: number,
): number {
  const belowVv = layoutH - vv.height - vv.offsetTop;
  return Math.max(0, Math.round(belowVv));
}

/**
 * iOS Safari / mobile: sync sticky stage height to visualViewport.
 * Spacing and card frames stay on static CSS vars (globals.css).
 */
export function syncScrollLinkedMobileViewport(): void {
  if (!isScrollLinkedMobileViewport()) return;

  const root = document.documentElement;
  const vv = window.visualViewport;
  const layoutH = window.innerHeight;

  const measuredBottom = readRootPx("--jade-mobile-chrome-bottom-px", 0);
  const chromeBottom =
    measuredBottom > 0
      ? measuredBottom
      : readRootPx("--jade-mobile-chrome-bottom", 80);

  const browserTop = Math.max(0, vv?.offsetTop ?? 0);
  /** Fixed navbar overlays content — never add site chrome to layout math on hide/show. */
  const siteTop = 0;
  const top = browserTop + siteTop;

  const vvHeight = vv?.height ?? layoutH;
  const toolbarBottom = vv ? readBrowserToolbarBottomInset(vv, layoutH) : 0;
  const effectiveChromeBottom = chromeBottom + toolbarBottom;

  const stageHeight = Math.max(
    200,
    Math.min(
      vvHeight - effectiveChromeBottom,
      layoutH - top - effectiveChromeBottom,
    ),
  );

  root.style.setProperty("--jade-vv-offset-top", `${browserTop}px`);
  root.style.setProperty("--jade-vv-height", `${vvHeight}px`);
  root.style.setProperty("--jade-vv-nav-inset", `${siteTop}px`);
  root.style.setProperty(
    "--jade-scroll-stage-mobile-height",
    `${stageHeight}px`,
  );

  getLenis()?.resize();
}

/** Measure fixed nav chrome heights into CSS vars (ResizeObserver). */
export function measureScrollLinkedChromeHeights(): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const navEl = document.querySelector(".jade-nav-chrome");
  const bottomEl = document.querySelector(".jade-scroll-chrome");

  if (navEl instanceof HTMLElement) {
    root.style.setProperty(
      "--jade-mobile-chrome-top-px",
      `${Math.ceil(navEl.getBoundingClientRect().height)}px`,
    );
  }

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
