/** Global Lenis instance (set in SmoothScroll). */

import {
  LENIS_EASING,
  LENIS_SCROLL_TO_DURATION,
} from "@/lib/lenisConfig";
import { smoothScrollTo } from "@/lib/smoothScrollTo";

export type LenisScrollToOptions = {
  immediate?: boolean;
  duration?: number;
  easing?: (t: number) => number;
  offset?: number;
  lock?: boolean;
  force?: boolean;
};

export type LenisInstance = {
  scroll: number;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: LenisScrollToOptions,
  ) => void;
  resize: () => void;
  stop: () => void;
  start: () => void;
  destroy: () => void;
  raf: (time: number) => void;
  on: (
    event: "scroll",
    callback: (lenis: {
      scroll: number;
      progress: number;
      velocity: number;
      direction: number;
    }) => void,
  ) => () => void;
};

export function getLenis(): LenisInstance | null {
  if (typeof window === "undefined") return null;
  return (
    (window as unknown as { __lenis?: LenisInstance | null }).__lenis ?? null
  );
}

const defaultScrollToOpts = (): LenisScrollToOptions => ({
  duration: LENIS_SCROLL_TO_DURATION,
  easing: LENIS_EASING,
});

/** Smooth scroll window via Lenis, or eased RAF fallback. */
export function scrollToY(
  top: number,
  options?: { immediate?: boolean; duration?: number },
) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(top, {
      ...defaultScrollToOpts(),
      immediate: options?.immediate,
      duration: options?.duration ?? LENIS_SCROLL_TO_DURATION,
    });
    return;
  }

  smoothScrollTo(window, top, {
    immediate: options?.immediate,
    duration: options?.duration
      ? options.duration * 1000
      : undefined,
  });
}

/** Scroll to a section element (sticky tab offset). */
export function scrollToElement(
  element: HTMLElement,
  options?: { offset?: number; immediate?: boolean; duration?: number },
) {
  const offset = options?.offset ?? 0;
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(element, {
      ...defaultScrollToOpts(),
      offset,
      immediate: options?.immediate,
      duration: options?.duration ?? LENIS_SCROLL_TO_DURATION,
    });
    return;
  }

  const top =
    element.getBoundingClientRect().top + window.scrollY + offset;
  smoothScrollTo(window, Math.max(0, top), {
    immediate: options?.immediate,
    duration: options?.duration
      ? options.duration * 1000
      : undefined,
  });
}
