/** Manual horizontal navigation tuning for scroll-linked sticky sections. */

/** Pointer gain — near 1:1; scaling happens in {@link horizontalDragToScrollDelta}. */
export const SCROLL_LINKED_DRAG_FACTOR = 1.0;
export const SCROLL_LINKED_MOBILE_DRAG_FACTOR = 1.12;

/** Extra multiplier on trackpad horizontal wheel */
export const SCROLL_LINKED_WHEEL_FACTOR = 1.15;

/**
 * ~55% of viewport width horizontal drag ≈ one panel step (mobile completes in one swipe).
 */
export const SCROLL_LINKED_SWIPE_VIEWPORT_RATIO = 0.55;

/** Mobile vertical scroll → slightly faster panel drift (balanced sensitivity, not sticky/linked) */
export const SCROLL_LINKED_FREE_MOBILE_PROGRESS_GAIN = 1.45;

/**
 * Pinned section height (vh). Taller = smoother vertical drift; mobile slightly shorter.
 */
export const SCROLL_LINKED_SECTION_VH = {
  home: { mobile: 520, desktop: 560 },
  experiences: { mobile: 520, desktop: 560 },
  wedding: { mobile: 440, desktop: 440 },
} as const;

function readSectionScrollableHeight(sectionEl: HTMLElement): number {
  return Math.max(1, sectionEl.offsetHeight - window.innerHeight);
}

/**
 * Map horizontal finger/wheel delta (px) → vertical scroll delta for scroll-linked sections.
 * A moderate horizontal swipe advances ~one card without feeling sticky or hyper-sensitive.
 */
export function horizontalDragToScrollDelta(
  deltaX: number,
  sectionEl: HTMLElement | null,
  stepCount: number,
  pointerGain = 1,
): number {
  if (!deltaX || !sectionEl) return 0;

  const scrollable = readSectionScrollableHeight(sectionEl);
  const steps = Math.max(1, stepCount);
  const pxPerStep = scrollable / steps;
  const swipeSpan = Math.max(
    280,
    window.innerWidth * SCROLL_LINKED_SWIPE_VIEWPORT_RATIO,
  );
  const scrollPerFingerPx = (pxPerStep / swipeSpan) * pointerGain;

  return -deltaX * scrollPerFingerPx;
}
