"use client";

import { useEffect, useRef } from "react";
import {
  clearScrollLinkedMobileViewport,
  isScrollLinkedMobileViewport,
  measureScrollLinkedChromeHeights,
  syncScrollLinkedMobileViewport,
} from "@/lib/scrollLinkedMobileViewport";

const SYNC_DEBOUNCE_MS = 40;

/**
 * Keeps scroll-linked panel CSS vars in sync with iOS visualViewport + navbar hide.
 * Mount once inside SmoothScroll (see providers.tsx).
 */
export default function ScrollLinkedViewportSync() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 1023px)");

    const runSyncNow = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!mq.matches) {
          clearScrollLinkedMobileViewport();
          return;
        }
        measureScrollLinkedChromeHeights();
        syncScrollLinkedMobileViewport();
      });
    };

    const scheduleSync = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(runSyncNow, SYNC_DEBOUNCE_MS);
    };

    const onMqChange = () => {
      if (!mq.matches) clearScrollLinkedMobileViewport();
      scheduleSync();
    };

    measureScrollLinkedChromeHeights();
    runSyncNow();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", scheduleSync);
    window.addEventListener("resize", scheduleSync, { passive: true });
    window.addEventListener("orientationchange", scheduleSync);
    mq.addEventListener("change", onMqChange);

    const burst = [80, 200, 500].map((ms) => setTimeout(runSyncNow, ms));

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleSync);
      const navEl = document.querySelector(".jade-nav-chrome");
      const bottomEl = document.querySelector(".jade-scroll-chrome");
      if (navEl) resizeObserver.observe(navEl);
      if (bottomEl) resizeObserver.observe(bottomEl);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      burst.forEach(clearTimeout);
      vv?.removeEventListener("resize", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("orientationchange", scheduleSync);
      mq.removeEventListener("change", onMqChange);
      resizeObserver?.disconnect();
      if (isScrollLinkedMobileViewport()) clearScrollLinkedMobileViewport();
    };
  }, []);

  return null;
}
