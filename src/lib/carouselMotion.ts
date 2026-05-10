"use client";

import { useEffect } from "react";

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
