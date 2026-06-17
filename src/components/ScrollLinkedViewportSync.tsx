"use client";

import { useEffect } from "react";
import {
  bootstrapScrollLinkedMobileViewport,
  clearScrollLinkedMobileViewport,
  isScrollLinkedMobileViewport,
} from "@/lib/scrollLinkedMobileViewport";

/**
 * One-time mobile scroll-linked bootstrap (orientation / width change only).
 * Does not observe navbar or visualViewport during scroll — header is overlay-only.
 */
export default function ScrollLinkedViewportSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 1023px)");

    const apply = () => {
      if (!mq.matches) {
        clearScrollLinkedMobileViewport();
        return;
      }
      bootstrapScrollLinkedMobileViewport();
    };

    apply();

    window.addEventListener("orientationchange", apply);
    window.addEventListener("resize", apply, { passive: true });
    mq.addEventListener("change", apply);

    const burst = [120, 400].map((ms) => setTimeout(apply, ms));

    return () => {
      burst.forEach(clearTimeout);
      window.removeEventListener("orientationchange", apply);
      window.removeEventListener("resize", apply);
      mq.removeEventListener("change", apply);
      if (isScrollLinkedMobileViewport()) clearScrollLinkedMobileViewport();
    };
  }, []);

  return null;
}
