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
  return window.innerWidth;
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

function computeOffsetPx(
  viewportWidth: number,
  panelWidth: number,
  variant: ScrollLinkedPanelGapVariant,
  visibleGapOverride: number | undefined,
): number {
  const isDesktop = window.matchMedia(DESKTOP_MQ).matches;
  if (visibleGapOverride !== undefined) {
    return computeLegacyOffsetPx(viewportWidth, panelWidth, visibleGapOverride);
  }
  if (isDesktop) {
    return computeDesktopOffsetPx(viewportWidth, panelWidth, variant);
  }
  return computeLegacyOffsetPx(
    viewportWidth,
    panelWidth,
    resolveScrollLinkedLegacyGapAddon(variant),
  );
}

/**
 * Horizontal scroll-linked panel offset — measured once per breakpoint resize.
 * Avoids visualViewport scroll listeners so card spacing stays fixed while scrolling.
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
      setViewportWidth(vw);
      setOffsetPx(
        computeOffsetPx(vw, panelWidth, variant, visibleGapOverride),
      );
    };

    recompute();

    const mq = window.matchMedia(DESKTOP_MQ);
    window.addEventListener("resize", recompute, { passive: true });
    window.addEventListener("orientationchange", recompute);
    mq.addEventListener("change", recompute);

    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("orientationchange", recompute);
      mq.removeEventListener("change", recompute);
    };
  }, [measureRef, visibleGapOverride, variant]);

  return { offsetPx, viewportWidth };
}
