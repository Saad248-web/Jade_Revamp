/** Shared tuning for scroll-linked *free* horizontal sections (not mobile snap). */

/** Less vertical scroll needed to traverse the full horizontal track (~40% boost). */
export const SCROLL_LINKED_FREE_SCROLL_GAIN = 1.4;

/**
 * Viewport-width fraction dragged for a full 0→1 progress sweep.
 * Lower = more sensitive horizontal drag.
 */
export const SCROLL_LINKED_FREE_DRAG_VIEWPORT_RATIO = 0.72;

/** Trackpad / mouse-wheel horizontal delta scaler. */
export const SCROLL_LINKED_FREE_WHEEL_GAIN = 0.0035;

export function scrollProgressFromSectionScroll(
  rawProgress: number,
  gain: number = SCROLL_LINKED_FREE_SCROLL_GAIN,
): number {
  return Math.min(1, Math.max(0, rawProgress * gain));
}

export function sectionScrollFromPanelProgress(
  panelProgress: number,
  gain: number = SCROLL_LINKED_FREE_SCROLL_GAIN,
): number {
  if (gain <= 0) return panelProgress;
  return Math.min(1, Math.max(0, panelProgress / gain));
}

export function scrollTopForPanelProgress(
  sectionEl: HTMLElement,
  panelProgress: number,
  gain: number = SCROLL_LINKED_FREE_SCROLL_GAIN,
): number | null {
  const maxScroll = sectionEl.offsetHeight - window.innerHeight;
  if (maxScroll <= 0) return null;
  const sectionTop = window.scrollY + sectionEl.getBoundingClientRect().top;
  const rawP = sectionScrollFromPanelProgress(panelProgress, gain);
  return sectionTop + rawP * maxScroll;
}
