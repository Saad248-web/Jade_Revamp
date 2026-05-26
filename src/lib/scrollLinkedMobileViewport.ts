/**
 * iOS Safari / mobile: sync scroll-linked panel stage to visualViewport so layout
 * does not break when browser chrome or the site navbar show/hide on scroll.
 */

import { getLenis } from "@/lib/lenis";
import { MOBILE_BOTTOM_NAV_CONTENT_GAP } from "@/lib/layoutSpacing";

const MOBILE_MQ = "(max-width: 1023px)";

/** Section label row inside sticky stage (WAYS JADE / counter). */
const SECTION_HEADER_PX = 36;

const CUSTOM_PROPS = [
  "--jade-vv-offset-top",
  "--jade-vv-height",
  "--jade-vv-nav-inset",
  "--jade-scroll-stage-mobile-height",
  "--jade-scroll-panel-row-height",
  "--jade-scroll-text-reserve",
  "--jade-scroll-card-max-h",
  "--jade-scroll-card-max-h-tall-header",
  "--jade-scroll-panel-gap",
  "--jade-scroll-panel-gap-lg",
  "--jade-scroll-panel-bottom-gap",
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

function clampGap(
  panelRowPx: number,
  minPx: number,
  vhFactor: number,
  maxPx: number,
): number {
  const fromVh = panelRowPx * vhFactor;
  return Math.round(Math.min(maxPx, Math.max(minPx, fromVh)));
}

/**
 * @param navHidden — from useBatchedScrollHide (navbar translated off-screen).
 */
export function syncScrollLinkedMobileViewport(navHidden: boolean): void {
  if (!isScrollLinkedMobileViewport()) return;

  const root = document.documentElement;
  const vv = window.visualViewport;
  const layoutH = window.innerHeight;

  const measuredTop = readRootPx("--jade-mobile-chrome-top-px", 0);
  const measuredBottom = readRootPx("--jade-mobile-chrome-bottom-px", 0);
  const chromeTop =
    measuredTop > 0 ? measuredTop : readRootPx("--jade-mobile-chrome-top", 56);
  const chromeBottom =
    measuredBottom > 0
      ? measuredBottom
      : readRootPx("--jade-mobile-chrome-bottom", 80);

  const browserTop = Math.max(0, vv?.offsetTop ?? 0);
  const siteTop = navHidden ? 0 : chromeTop;
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

  const panelRow = Math.max(160, stageHeight - SECTION_HEADER_PX);
  root.style.setProperty("--jade-scroll-panel-row-height", `${panelRow}px`);

  const panelGap = clampGap(panelRow, 6, 0.024, 12);
  const panelGapLg = clampGap(panelRow, 8, 0.032, 20);
  root.style.setProperty("--jade-scroll-panel-gap", `${panelGap}px`);
  root.style.setProperty("--jade-scroll-panel-gap-lg", `${panelGapLg}px`);
  root.style.setProperty(
    "--jade-scroll-panel-bottom-gap",
    MOBILE_BOTTOM_NAV_CONTENT_GAP,
  );

  setCardMaxHeights(root, panelRow, panelGap, panelGapLg);

  getLenis()?.resize();
}

function setCardMaxHeights(
  root: HTMLElement,
  panelRowPx: number,
  panelGap: number,
  panelGapLg: number,
): void {
  const stackGaps = panelGap * 3 + panelGapLg;
  const textReserve = Math.min(
    240,
    Math.max(200, Math.round(panelRowPx * 0.46) + stackGaps),
  );
  const tallHeaderReserve = textReserve + 28;

  root.style.setProperty("--jade-scroll-text-reserve", `${textReserve}px`);

  const cardMax = Math.min(600, Math.max(132, panelRowPx - textReserve));
  const cardMaxTall = Math.min(
    560,
    Math.max(120, panelRowPx - tallHeaderReserve),
  );

  root.style.setProperty("--jade-scroll-card-max-h", `${cardMax}px`);
  root.style.setProperty(
    "--jade-scroll-card-max-h-tall-header",
    `${cardMaxTall}px`,
  );
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
