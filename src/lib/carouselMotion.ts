"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import type { PanInfo } from "framer-motion";

/** Tailwind `lg` — swipe enabled below this width (mobile + tablet). */
export const CAROUSEL_SWIPE_MAX_WIDTH_PX = 1023;

const CAROUSEL_SWIPE_MEDIA_QUERY = `(max-width: ${CAROUSEL_SWIPE_MAX_WIDTH_PX}px)`;

export const CAROUSEL_SWIPE_CONFIDENCE_THRESHOLD = 10000;

/** Minimum horizontal drag (px) before advancing — desktop mouse drags */
export const CAROUSEL_DRAG_OFFSET_THRESHOLD_PX = 48;

export function carouselSwipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

function subscribeCarouselSwipeEnabled(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(CAROUSEL_SWIPE_MEDIA_QUERY);
  const handler = () => onStoreChange();
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

function getCarouselSwipeEnabledSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(CAROUSEL_SWIPE_MEDIA_QUERY).matches;
}

/** True when viewport is mobile/tablet (&lt; lg). SSR-safe default: false. */
export function useCarouselSwipeEnabled() {
  return useSyncExternalStore(
    subscribeCarouselSwipeEnabled,
    getCarouselSwipeEnabledSnapshot,
    () => false,
  );
}

export function resolveCarouselSwipeFromDrag(
  offsetX: number,
  velocityX: number,
  onPrev: () => void,
  onNext: () => void,
) {
  if (offsetX <= -CAROUSEL_DRAG_OFFSET_THRESHOLD_PX) {
    onNext();
    return;
  }
  if (offsetX >= CAROUSEL_DRAG_OFFSET_THRESHOLD_PX) {
    onPrev();
    return;
  }

  const swipe = carouselSwipePower(offsetX, velocityX);
  if (swipe < -CAROUSEL_SWIPE_CONFIDENCE_THRESHOLD) onNext();
  else if (swipe > CAROUSEL_SWIPE_CONFIDENCE_THRESHOLD) onPrev();
}

type CarouselSwipeDragOptions = {
  /** When true, only enable below `lg` (legacy touch-only rails). Default: false. */
  mobileOnly?: boolean;
};

/** Framer drag props for horizontal swipe / grab-drag navigation. */
export function useCarouselSwipeDragProps(
  onPrev: () => void,
  onNext: () => void,
  enabled: boolean = true,
  options?: CarouselSwipeDragOptions,
) {
  const swipeEnabled = useCarouselSwipeEnabled();
  const mobileOnly = options?.mobileOnly ?? false;
  const active = enabled && (mobileOnly ? swipeEnabled : true);

  const onDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      resolveCarouselSwipeFromDrag(info.offset.x, info.velocity.x, onPrev, onNext);
    },
    [onPrev, onNext],
  );

  return useMemo(() => {
    if (!active) {
      return { drag: false as const };
    }
    return {
      drag: "x" as const,
      dragConstraints: { left: 0, right: 0 },
      dragElastic: 0.12,
      onDragEnd,
    };
  }, [active, onDragEnd]);
}

/**
 * Snap scroll progress to discrete steps with a cinematic dwell.
 *
 * Within each step's scroll range the output follows an easeInOutCubic ramp,
 * but holds at the step's centre for ~`dwellRatio` of the range on each side —
 * so each card eases into the centre, locks momentarily, then eases to the next.
 * Reduced-motion users get a hard snap.
 */
export function useSnappedScrollProgress(
  progress: MotionValue<number>,
  stepCount: number,
  reducedMotion: boolean | null,
  dwellRatio: number = 0.3,
) {
  return useTransform(progress, (p) => {
    if (stepCount <= 1) return p;
    const maxIndex = stepCount - 1;
    const rawIndex = Math.min(maxIndex, Math.max(0, p * maxIndex));

    if (reducedMotion) {
      return Math.round(rawIndex) / maxIndex;
    }

    const i = Math.floor(rawIndex);
    if (i >= maxIndex) return 1;

    const t = rawIndex - i;
    const dwell = Math.min(0.45, Math.max(0, dwellRatio));
    let eased: number;
    if (t <= dwell) {
      eased = 0;
    } else if (t >= 1 - dwell) {
      eased = 1;
    } else {
      const k = (t - dwell) / (1 - 2 * dwell);
      eased =
        k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    }
    return (i + eased) / maxIndex;
  });
}

/** Shared crossfade timings for hero + carousel image transitions */
export const CAROUSEL_CROSSFADE = {
  duration: 0.8,
  ease: [0.32, 0.72, 0, 1] as const,
};

/** Villa detail spaces / experiences — snappy crossfade */
export const CAROUSEL_CROSSFADE_FAST = {
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
};

/** Auto-advance interval for villa detail media carousels */
export const VILLA_DETAIL_CAROUSEL_INTERVAL_MS = 1800;

type CarouselAutoAdvanceOptions = {
  onNext: () => void;
  enabled: boolean;
  intervalMs?: number;
};

/** Timed advance; pauses on hover, while tab is hidden, and when reduced motion is on. */
export function useCarouselAutoAdvance({
  onNext,
  enabled,
  intervalMs = VILLA_DETAIL_CAROUSEL_INTERVAL_MS,
}: CarouselAutoAdvanceOptions) {
  const reducedMotion = useReducedMotion();
  const pausedRef = useRef(false);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const onVisibility = () => {
      pausedRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const id = window.setInterval(() => {
      if (!pausedRef.current) onNextRef.current();
    }, intervalMs);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(id);
    };
  }, [enabled, intervalMs, reducedMotion]);

  return { pause, resume };
}

type SlidePair = { bgImage?: string; cardImage?: string };

/** Preload previous/next slide images to reduce lag on arrow clicks */
export function usePreloadNeighborSlideImages(
  slides: readonly SlidePair[],
  index: number,
) {
  useEffect(() => {
    const n = slides.length;
    if (n <= 1) return;
    for (const j of [(index + 1) % n, (index - 1 + n) % n]) {
      const s = slides[j];
      if (!s) continue;
      for (const key of ["bgImage", "cardImage"] as const) {
        const url = s[key]?.trim();
        if (url) {
          const img = new window.Image();
          img.src = url;
        }
      }
    }
  }, [slides, index]);
}

export function usePreloadNeighborImages(
  imageUrls: readonly string[],
  index: number,
) {
  useEffect(() => {
    const n = imageUrls.length;
    if (n <= 1) return;
    for (const j of [(index + 1) % n, (index - 1 + n) % n]) {
      const url = imageUrls[j]?.trim();
      if (url) {
        const img = new window.Image();
        img.src = url;
      }
    }
  }, [imageUrls, index]);
}
