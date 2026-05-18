"use client";

import { useEffect } from "react";
import { useTransform, type MotionValue } from "framer-motion";

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
