/**
 * Scroll-driven panel motion math for JS-driven fallback
 * when CSS scroll-driven animations are unavailable (Safari, Firefox, etc.).
 */

import type { CSSProperties } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Apply animation-range-start ~30cqw on text layers (maps to ~18–24% of normalized scroll band). */
function applyRangeStart(vp: number, rangeStartNorm = 0.2) {
  if (vp <= rangeStartNorm) return 0;
  return clamp((vp - rangeStartNorm) / (1 - rangeStartNorm), 0, 1);
}

/**
 * Grow phase from measured slide geometry.
 *
 * Uses a **view-style** mapping so when a slide **fills** the scrollport (scrollPos ≈ slideStart),
 * phase is ~mid-range — matching CSS `view()` timelines. The naive
 * `(scrollPos - slideStart) / (slide + view*0.38)` yields **0 at rest** → `growStyle(0)` is ~15% scale
 * (looks like a black / empty frame in Firefox).
 */
export function growPhaseFromScrollGeometry(
  scrollPos: number,
  slideStartInContent: number,
  slideSpan: number,
  viewSpan: number,
): number {
  const denom = slideSpan + viewSpan;
  const numer = scrollPos - slideStartInContent + viewSpan;
  return clamp(numer / Math.max(1e-6, denom), 0, 1);
}

/** Text/copy: grow phase + `animation-range-start: 30cqw` delay (Demo 1 §5.3). */
export function textPhaseFromScrollGeometry(
  scrollPos: number,
  slideStartInContent: number,
  slideSpan: number,
  viewSpan: number,
): number {
  return applyRangeStart(
    growPhaseFromScrollGeometry(
      scrollPos,
      slideStartInContent,
      slideSpan,
      viewSpan,
    ),
  );
}

/**
 * @deprecated for JS path — prefer `growPhaseFromScrollGeometry` with measured `offsetLeft` / rects.
 * Kept for index-only math (tests / simple layouts).
 */
export function viewProgressForSlide(
  scrollLeft: number,
  slideIndex: number,
  slideW: number,
  viewW: number,
  _rangeStartPx: number,
): number {
  const slideStart = slideIndex * slideW;
  const range = slideW + viewW * 0.38;
  return clamp(
    (scrollLeft - slideStart) / Math.max(1e-6, range),
    0,
    1,
  );
}

export function viewProgressForText(
  scrollLeft: number,
  slideIndex: number,
  slideW: number,
  viewW: number,
  _rangeStartPx: number,
): number {
  const slideStart = slideIndex * slideW;
  return textPhaseFromScrollGeometry(
    scrollLeft,
    slideStart,
    slideW,
    viewW,
  );
}

/** Global scroller progress for progress bar (same as --scroller timeline). */
export function scrollerProgress(scrollLeft: number, maxScroll: number) {
  if (maxScroll <= 0) return 1;
  return clamp(scrollLeft / maxScroll, 0, 1);
}

/** experience-sda-grow keyframes → inline styles (horizontal weighting — matches Chrome native timeline). */
export function growStyle(
  vp: number,
  cw: number,
  ch: number,
): CSSProperties {
  const u = clamp(vp, 0, 1);
  const kp = u * 100;
  const cqmin = Math.min(0.35 * cw, 0.35 * ch);

  if (kp <= 58.75) {
    const t = kp / 58.75;
    const rightInset = 25 * (1 - t);
    const roundPx = cqmin * (1 - t);
    const txPct = 70 * (1 - t);
    const sc = 0.15 + (1 - 0.15) * t;
    const clip = `inset(0 ${rightInset}% round ${roundPx}px)`;
    return {
      clipPath: clip,
      WebkitClipPath: clip,
      transform: `translateX(${txPct}%) scale(${sc})`,
    };
  }
  const t = (kp - 58.75) / (100 - 58.75);
  const scale = 1 + 0.5 * t;
  const txPct = -16 * t;
  return {
    clipPath: "inset(0)",
    WebkitClipPath: "inset(0)",
    transform: `scale(${scale}) translateX(${txPct}%)`,
  };
}

/**
 * Same timing bands as `growStyle` / `@keyframes experience-sda-grow`, but **vertical analogy** for the
 * JS + vertical-scroll path: bottom-weighted clip + translateY (reveal rises with scroll) instead of
 * right-weighted + translateX. Keeps one-to-one keyframe % with Chrome’s horizontal motion.
 */
export function growStyleVertical(
  vp: number,
  cw: number,
  ch: number,
): CSSProperties {
  const u = clamp(vp, 0, 1);
  const kp = u * 100;
  const cqmin = Math.min(0.35 * cw, 0.35 * ch);

  if (kp <= 58.75) {
    const t = kp / 58.75;
    const bottomInset = 25 * (1 - t);
    const roundPx = cqmin * (1 - t);
    const tyPct = 70 * (1 - t);
    const sc = 0.15 + (1 - 0.15) * t;
    const clip = `inset(0 0 ${bottomInset}% 0 round ${roundPx}px)`;
    return {
      clipPath: clip,
      WebkitClipPath: clip,
      transform: `translateY(${tyPct}%) scale(${sc})`,
    };
  }
  const t = (kp - 58.75) / (100 - 58.75);
  const scale = 1 + 0.5 * t;
  const tyPct = -16 * t;
  return {
    clipPath: "inset(0)",
    WebkitClipPath: "inset(0)",
    transform: `scale(${scale}) translateY(${tyPct}%)`,
  };
}

export type Demo1GrowVariant = "horizontal" | "vertical";

/** Dispatches to Demo 1 horizontal (Chrome) vs vertical-analogy grow. */
export function growStyleByVariant(
  variant: Demo1GrowVariant,
  vp: number,
  cw: number,
  ch: number,
): CSSProperties {
  return variant === "vertical"
    ? growStyleVertical(vp, cw, ch)
    : growStyle(vp, cw, ch);
}

/** experience-sda-text — initial headline: translateY 205%, skewY 6deg */
export function textStyleHeadline(vp: number): CSSProperties {
  const k = vp * 100;
  if (k <= 25) {
    return {
      opacity: 0,
      transform: "translateY(205%) skewY(6deg)",
    };
  }
  if (k <= 50) {
    const t = (k - 25) / 25;
    const ty = 205 * (1 - t);
    const skew = 6 * (1 - t);
    return {
      opacity: t,
      transform: `translateY(${ty}%) skewY(${skew}deg)`,
    };
  }
  if (k <= 75) {
    const t = (k - 50) / 25;
    return {
      opacity: 1 - t,
      transform: "none",
    };
  }
  return { opacity: 0, transform: "none" };
}

/** Body / CTA: translateY 50%, skewY 1.5deg */
export function textStyleBody(vp: number): CSSProperties {
  const k = vp * 100;
  if (k <= 25) {
    return {
      opacity: 0,
      transform: "translateY(50%) skewY(1.5deg)",
    };
  }
  if (k <= 50) {
    const t = (k - 25) / 25;
    const ty = 50 * (1 - t);
    const skew = 1.5 * (1 - t);
    return {
      opacity: t,
      transform: `translateY(${ty}%) skewY(${skew}deg)`,
    };
  }
  if (k <= 75) {
    const t = (k - 50) / 25;
    return {
      opacity: 1 - t,
      transform: "none",
    };
  }
  return { opacity: 0, transform: "none" };
}

/** experience-sda-text-up */
export function textUpStyle(vp: number): CSSProperties {
  const k = vp * 100;
  if (k <= 25) {
    return {
      opacity: 0.5,
      transform: "translateY(105%)",
    };
  }
  if (k <= 50) {
    const t = (k - 25) / 25;
    return {
      opacity: 0.5 + 0.5 * t,
      transform: `translateY(${105 * (1 - t)}%)`,
    };
  }
  if (k <= 75) {
    const t = (k - 50) / 25;
    return {
      opacity: 1 - 0.5 * t,
      transform: `translateY(${-105 * t}%)`,
    };
  }
  return {
    opacity: 0.5,
    transform: "translateY(-105%)",
  };
}

/** experience-sda-page */
export function pageIndexStyle(vp: number): CSSProperties {
  const k = vp * 100;
  if (k <= 58) {
    const t = k / 58;
    return { opacity: 0.5 + 0.5 * t };
  }
  if (k >= 100 - 1e-6) return { opacity: 0.5 };
  const t = (k - 58) / (100 - 58);
  return { opacity: 1 - 0.5 * t };
}

/** Progress bar fill scaleX */
export function progressStyle(p: number, slideCount: number): CSSProperties {
  const from = 1 / slideCount;
  const scale = from + (1 - from) * p;
  return {
    transform: `scaleX(${scale})`,
    transformOrigin: "left center",
  };
}
