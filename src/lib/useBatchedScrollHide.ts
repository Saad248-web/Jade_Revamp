"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeLenisScroll } from "@/lib/lenisScrollBridge";
import { scheduleScrollUpdate } from "@/lib/batchScrollUpdate";

/**
 * Hide fixed/sticky chrome after scrolling down (max 1 React update per frame).
 * Uses Lenis scroll position + direction when velocity is meaningful.
 */
export function useBatchedScrollHide(threshold = 150) {
  const [isHidden, setIsHidden] = useState(false);
  const lastY = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    const apply = (shouldHide: boolean) => {
      if (shouldHide !== hiddenRef.current) {
        hiddenRef.current = shouldHide;
        setIsHidden(shouldHide);
      }
    };

    const evaluate = (y: number, direction?: number, velocity?: number) => {
      const prev = lastY.current;
      lastY.current = y;

      if (y <= threshold) {
        apply(false);
        return;
      }

      const moving = velocity != null && Math.abs(velocity) > 0.15;
      if (moving && direction != null && direction !== 0) {
        apply(direction > 0);
        return;
      }

      if (y > prev) apply(true);
      else if (y < prev) apply(false);
    };

    const onWindowScroll = () => {
      scheduleScrollUpdate(() => evaluate(window.scrollY));
    };

    const unsubLenis = subscribeLenisScroll(({ scroll, direction, velocity }) => {
      evaluate(scroll, direction, velocity);
    });

    window.addEventListener("scroll", onWindowScroll, { passive: true });

    return () => {
      unsubLenis();
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, [threshold]);

  return isHidden;
}
