"use client";

import { useEffect, useRef, type RefObject } from "react";
import { scheduleScrollUpdate } from "@/lib/batchScrollUpdate";
import { resolveActiveScrollSection } from "@/lib/resolveActiveScrollSection";
import { isScrollSpyLocked } from "@/lib/scrollSpyLock";
import { subscribeLenisScroll } from "@/lib/lenisScrollBridge";

export type SectionScrollSpyOptions = {
  /** DOM ids of sections in scroll order (top → bottom). */
  sectionIds: readonly string[];
  /** Called with the topmost visible section id. */
  onActiveSection: (sectionId: string) => void;
  /** Scroll container; omit for viewport (window / Lenis). */
  root?: Element | null;
  rootRef?: RefObject<Element | null>;
  enabled?: boolean;
  /** Bump when scroll root ref is attached (overlay layout sync). */
  rootVersion?: number;
  /** Anchor line offset inside root (px from top) — match sticky tab height. */
  offsetPx?: number;
};

function observeSections(
  sectionIds: readonly string[],
  observer: IntersectionObserver,
) {
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/**
 * Highlights the active section while scrolling (villa detail + venue overlays).
 * Position-based spy (sequential sections) + scroll listeners for Lenis / inner panels.
 */
export function useSectionScrollSpy({
  sectionIds,
  onActiveSection,
  root = null,
  rootRef,
  enabled = true,
  rootVersion = 0,
  offsetPx = 96,
}: SectionScrollSpyOptions) {
  const onActiveRef = useRef(onActiveSection);
  onActiveRef.current = onActiveSection;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const scrollRoot = rootRef?.current ?? root ?? null;

    const publishActive = () => {
      if (isScrollSpyLocked()) return;
      const bestId = resolveActiveScrollSection(
        sectionIds,
        scrollRoot,
        offsetPx,
      );
      if (bestId) onActiveRef.current(bestId);
    };

    const schedulePublish = () => scheduleScrollUpdate(publishActive);

    const observer = new IntersectionObserver(
      () => schedulePublish(),
      { root: scrollRoot, rootMargin: "0px", threshold: 0 },
    );

    observeSections(sectionIds, observer);

    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;
    scrollTarget.addEventListener("scroll", schedulePublish, { passive: true });

    const unsubLenis =
      scrollRoot == null ? subscribeLenisScroll(() => schedulePublish()) : undefined;

    const retryObserve = window.setTimeout(() => {
      observeSections(sectionIds, observer);
      publishActive();
    }, 120);

    const rafId = requestAnimationFrame(() => publishActive());

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(retryObserve);
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", schedulePublish);
      unsubLenis?.();
    };
  }, [sectionIds, root, rootRef, enabled, rootVersion, offsetPx]);
}
