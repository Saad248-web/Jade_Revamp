"use client";

import { useEffect, useState, type RefObject } from "react";

export type UseScrollLinkedPanelOffsetOptions = {
  /** Gap between centered panel and next peek (Section 3: 20, Featured: 56). */
  visibleGap?: number;
};

/** Tailwind max-width fallbacks when measure ref is not mounted. */
export function fallbackScrollLinkedPanelWidth(viewportWidth: number): number {
  const panelWidth =
    viewportWidth >= 1280
      ? 896
      : viewportWidth >= 768
        ? 672
        : viewportWidth >= 640
          ? 512
          : 448;
  return Math.min(panelWidth, viewportWidth - 48);
}

function readViewportWidth(): number {
  if (typeof window === "undefined") return 375;
  return window.visualViewport?.width ?? window.innerWidth;
}

function computeOffsetPx(
  viewportWidth: number,
  panelWidth: number,
  visibleGap: number,
): number {
  return Math.ceil(viewportWidth / 2 + panelWidth / 2 + visibleGap);
}

/**
 * Horizontal scroll-linked panel offset — visualViewport-aware, remeasures on
 * resize / orientation / visualViewport (matches ScrollLinkedViewportSync burst).
 */
export function useScrollLinkedPanelOffset(
  measureRef: RefObject<HTMLElement | null>,
  options: UseScrollLinkedPanelOffsetOptions = {},
): { offsetPx: number; viewportWidth: number } {
  const visibleGap = options.visibleGap ?? 20;
  const [offsetPx, setOffsetPx] = useState(1000);
  const [viewportWidth, setViewportWidth] = useState(1920);

  useEffect(() => {
    const recompute = () => {
      const vw = readViewportWidth();
      const measured = measureRef.current?.offsetWidth;
      const panelWidth =
        measured && measured > 0
          ? measured
          : fallbackScrollLinkedPanelWidth(vw);
      setViewportWidth(vw);
      setOffsetPx(computeOffsetPx(vw, panelWidth, visibleGap));
    };

    recompute();

    const burst = [80, 200, 500].map((ms) => setTimeout(recompute, ms));
    const vv = window.visualViewport;
    vv?.addEventListener("resize", recompute);
    vv?.addEventListener("scroll", recompute);
    window.addEventListener("resize", recompute, { passive: true });
    window.addEventListener("orientationchange", recompute);

    return () => {
      burst.forEach(clearTimeout);
      vv?.removeEventListener("resize", recompute);
      vv?.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
      window.removeEventListener("orientationchange", recompute);
    };
  }, [measureRef, visibleGap]);

  return { offsetPx, viewportWidth };
}
