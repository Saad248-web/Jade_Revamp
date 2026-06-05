"use client";

import { useEffect, useState, type RefObject } from "react";
import {
  SCROLL_LINKED_DESKTOP_PEEK_RATIO,
  resolveScrollLinkedLegacyGapAddon,
  type ScrollLinkedPanelGapVariant,
} from "@/lib/scrollLinkedPanelLayout";

const DESKTOP_MQ = "(min-width: 1024px)";

export type UseScrollLinkedPanelOffsetOptions = {
  /** @deprecated Use variant — visibleGap overrides breakpoint constants when set. */
  visibleGap?: number;
  variant?: ScrollLinkedPanelGapVariant;
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

/**
 * Legacy mobile offset — also used when visibleGap is explicitly overridden.
 */
function computeLegacyOffsetPx(
  viewportWidth: number,
  panelWidth: number,
  gapAddon: number,
): number {
  return Math.ceil(viewportWidth / 2 + panelWidth / 2 + gapAddon);
}

/**
 * Desktop/laptop: visible peek between card edges ≈ offsetPx − panelWidth.
 * Scale legacy peek by SCROLL_LINKED_DESKTOP_PEEK_RATIO (keep 20% = −80%).
 */
function computeDesktopOffsetPx(
  viewportWidth: number,
  panelWidth: number,
  variant: ScrollLinkedPanelGapVariant,
): number {
  const legacyAddon = resolveScrollLinkedLegacyGapAddon(variant);
  const legacyPeek = viewportWidth / 2 - panelWidth / 2 + legacyAddon;
  const desktopPeek = Math.max(0, legacyPeek * SCROLL_LINKED_DESKTOP_PEEK_RATIO);
  return Math.ceil(panelWidth + desktopPeek);
}

/**
 * Horizontal scroll-linked panel offset — visualViewport-aware, remeasures on
 * resize / orientation / visualViewport (matches ScrollLinkedViewportSync burst).
 */
export function useScrollLinkedPanelOffset(
  measureRef: RefObject<HTMLElement | null>,
  options: UseScrollLinkedPanelOffsetOptions = {},
): { offsetPx: number; viewportWidth: number } {
  const variant = options.variant ?? "standard";
  const visibleGapOverride = options.visibleGap;
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
      const isDesktop = window.matchMedia(DESKTOP_MQ).matches;
      setViewportWidth(vw);
      if (visibleGapOverride !== undefined) {
        setOffsetPx(computeLegacyOffsetPx(vw, panelWidth, visibleGapOverride));
      } else if (isDesktop) {
        setOffsetPx(computeDesktopOffsetPx(vw, panelWidth, variant));
      } else {
        setOffsetPx(
          computeLegacyOffsetPx(
            vw,
            panelWidth,
            resolveScrollLinkedLegacyGapAddon(variant),
          ),
        );
      }
    };

    recompute();

    const burst = [80, 200, 500].map((ms) => setTimeout(recompute, ms));
    const mq = window.matchMedia(DESKTOP_MQ);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", recompute);
    vv?.addEventListener("scroll", recompute);
    window.addEventListener("resize", recompute, { passive: true });
    window.addEventListener("orientationchange", recompute);
    mq.addEventListener("change", recompute);

    return () => {
      burst.forEach(clearTimeout);
      vv?.removeEventListener("resize", recompute);
      vv?.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
      window.removeEventListener("orientationchange", recompute);
      mq.removeEventListener("change", recompute);
    };
  }, [measureRef, visibleGapOverride, variant]);

  return { offsetPx, viewportWidth };
}
