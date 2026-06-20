"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PanInfo } from "framer-motion";
import { getLenis } from "@/lib/lenis";
import { subscribeLenisScroll } from "@/lib/lenisScrollBridge";
import {
  SCROLL_LINKED_DRAG_FACTOR,
  SCROLL_LINKED_MOBILE_DRAG_FACTOR,
  SCROLL_LINKED_WHEEL_FACTOR,
  horizontalDragToScrollDelta,
} from "@/lib/scrollLinkedFreeScroll";

export type UseScrollLinkedManualNavigationOptions = {
  enabled: boolean;
  showHint?: boolean;
  /** End-of-section “scroll down” cue — independent from horizontal hint */
  showVerticalHint?: boolean;
  sectionRef?: React.RefObject<HTMLElement | null>;
  /** Panel steps in the section (cards + end CTA) — drives swipe distance per card */
  stepCount?: number;
  /**
   * After vertical scroll momentum ends, snap to the nearest card.
   * Only enable for `mobileSnapOnly` — free sections must not hijack page scroll.
   */
  snapOnScrollEnd?: boolean;
};

export type ScrollLinkedStageNavigation = {
  stageRef: React.RefObject<HTMLDivElement | null>;
  onPanStart: (event: PointerEvent) => void;
  onPan: (event: PointerEvent, info: PanInfo) => void;
  onPanEnd: () => void;
  showHint: boolean;
  showVerticalHint: boolean;
  dismissHint: () => void;
  isDragging: boolean;
};

const NO_PAN_SELECTOR = "[data-jade-stage-no-pan]";
const TOUCH_AXIS_LOCK_PX = 10;

function pointerGain(pointerType?: string): number {
  if (pointerType === "touch" || pointerType === "pen") {
    return SCROLL_LINKED_MOBILE_DRAG_FACTOR;
  }
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return SCROLL_LINKED_MOBILE_DRAG_FACTOR;
  }
  return SCROLL_LINKED_DRAG_FACTOR;
}

function scrollByDelta(dy: number): void {
  if (!dy) return;
  const isCoarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const lenis = getLenis();

  // Mobile uses native touch scroll (Lenis syncTouch off) — scrollBy keeps momentum in sync.
  if (isCoarse || !lenis) {
    window.scrollBy(0, dy);
    return;
  }

  lenis.scrollTo(lenis.scroll + dy, { immediate: true });
}

function resolveSectionEl(
  sectionRef: React.RefObject<HTMLElement | null> | undefined,
  stageEl: HTMLElement | null,
): HTMLElement | null {
  if (sectionRef?.current) return sectionRef.current;
  return stageEl?.closest("section") ?? null;
}

function readSectionProgress(sectionEl: HTMLElement): number {
  const scrollable = Math.max(1, sectionEl.offsetHeight - window.innerHeight);
  return Math.max(
    0,
    Math.min(1, (window.scrollY - sectionEl.offsetTop) / scrollable),
  );
}

/** True when scrollY is inside this section's pinned travel range (not above/below it). */
function isSectionInActiveScrollRange(
  section: HTMLElement,
  tolerancePx = 8,
): boolean {
  const scrollY = window.scrollY;
  const top = section.offsetTop;
  const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
  const maxY = top + scrollable;
  return scrollY >= top - tolerancePx && scrollY <= maxY + tolerancePx;
}

function snapSectionToNearestStep(
  sectionRef: React.RefObject<HTMLElement | null> | undefined,
  stageEl: HTMLElement | null,
  stepCount: number,
): void {
  const section = resolveSectionEl(sectionRef, stageEl);
  if (!section) return;

  const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
  const progress = readSectionProgress(section);
  const maxIndex = Math.max(1, stepCount - 1);
  const snappedProgress = Math.round(progress * maxIndex) / maxIndex;
  const targetY = section.offsetTop + snappedProgress * scrollable;
  const dy = targetY - window.scrollY;

  if (Math.abs(dy) < 3) return;
  scrollByDelta(dy);
}

export function useScrollLinkedManualNavigation({
  enabled,
  showHint: showHintOption = true,
  showVerticalHint: showVerticalHintOption = true,
  sectionRef,
  stepCount = 2,
  snapOnScrollEnd = false,
}: UseScrollLinkedManualNavigationOptions): ScrollLinkedStageNavigation {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const ignorePanRef = useRef(false);
  const pointerTypeRef = useRef<string>("mouse");
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(enabled && showHintOption);
  const [showVerticalHint, setShowVerticalHint] = useState(
    enabled && showVerticalHintOption,
  );
  const lastScrollYRef = useRef(0);

  const dismissHint = useCallback(() => setShowHint(false), []);
  const dismissVerticalHint = useCallback(() => setShowVerticalHint(false), []);

  const applyHorizontalDelta = useCallback(
    (deltaX: number, gain: number) => {
      const section = resolveSectionEl(sectionRef, stageRef.current);
      const dy = horizontalDragToScrollDelta(deltaX, section, stepCount, gain);
      scrollByDelta(dy);
    },
    [sectionRef, stepCount],
  );

  useEffect(() => {
    if (!enabled || !showVerticalHint) return;

    const onScrollSample = (scroll: number) => {
      const section = resolveSectionEl(sectionRef, stageRef.current);
      if (!section) return;

      const progress = readSectionProgress(section);
      const delta = scroll - lastScrollYRef.current;
      lastScrollYRef.current = scroll;

      // Dismiss only when user scrolls down near the section tail (leaving the end card).
      if (progress > 0.94 && delta > 8) {
        dismissVerticalHint();
      }
    };

    const onWindowScroll = () => onScrollSample(window.scrollY);
    window.addEventListener("scroll", onWindowScroll, { passive: true });

    const unsub = subscribeLenisScroll(({ scroll }) => onScrollSample(scroll));

    lastScrollYRef.current = getLenis()?.scroll ?? window.scrollY;
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      unsub();
    };
  }, [enabled, showVerticalHint, sectionRef, dismissVerticalHint]);

  // After native touch momentum settles, snap to the nearest card (mobileSnapOnly only).
  useEffect(() => {
    if (!enabled || !snapOnScrollEnd) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (draggingRef.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!draggingRef.current) {
          snapSectionToNearestStep(sectionRef, stageRef.current, stepCount);
        }
      }, 90);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [enabled, snapOnScrollEnd, sectionRef, stepCount]);

  useEffect(() => {
    if (!enabled) return;
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX <= absY) return;
      event.preventDefault();
      // Trackpad deltaX sign is opposite pan/touch — invert so swipe-right advances forward.
      applyHorizontalDelta(-event.deltaX, SCROLL_LINKED_WHEEL_FACTOR);
      dismissHint();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [enabled, dismissHint, applyHorizontalDelta]);

  // Mobile horizontal finger swipe — scaled to section width (Framer pan alone is 1:1 px → too stiff).
  useEffect(() => {
    if (!enabled) return;
    const el = stageRef.current;
    if (!el) return;

    let touchId: number | null = null;
    let lastX = 0;
    let axisLocked: "none" | "horizontal" | "vertical" = "none";
    let originX = 0;
    let originY = 0;

    const resetTouch = () => {
      touchId = null;
      axisLocked = "none";
      if (draggingRef.current) {
        draggingRef.current = false;
        setIsDragging(false);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const target = event.target as Element | null;
      if (target?.closest(NO_PAN_SELECTOR)) return;

      const touch = event.touches[0];
      touchId = touch.identifier;
      lastX = touch.clientX;
      originX = touch.clientX;
      originY = touch.clientY;
      axisLocked = "none";
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchId === null) return;
      const touch = Array.from(event.touches).find((t) => t.identifier === touchId);
      if (!touch) return;

      const dx = touch.clientX - originX;
      const dy = touch.clientY - originY;

      if (axisLocked === "none") {
        if (Math.abs(dx) < TOUCH_AXIS_LOCK_PX && Math.abs(dy) < TOUCH_AXIS_LOCK_PX) {
          return;
        }
        axisLocked = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical";
        if (axisLocked === "vertical") {
          resetTouch();
          return;
        }
        draggingRef.current = true;
        setIsDragging(true);
        dismissHint();
      }

      if (axisLocked !== "horizontal") return;

      event.preventDefault();
      const step = touch.clientX - lastX;
      lastX = touch.clientX;
      applyHorizontalDelta(step, SCROLL_LINKED_MOBILE_DRAG_FACTOR);
    };

    const onTouchEnd = () => {
      if (axisLocked === "horizontal") {
        snapSectionToNearestStep(sectionRef, el, stepCount);
      }
      resetTouch();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled, dismissHint, applyHorizontalDelta, sectionRef, stepCount]);

  const onPanStart = useCallback(
    (event: PointerEvent) => {
      if (!enabled) return;
      if (event.pointerType === "touch") return;
      const target = event?.target as Element | null;
      if (target && target.closest(NO_PAN_SELECTOR)) {
        ignorePanRef.current = true;
        return;
      }
      ignorePanRef.current = false;
      pointerTypeRef.current = event.pointerType;
      draggingRef.current = true;
      setIsDragging(true);
      dismissHint();
    },
    [enabled, dismissHint],
  );

  const onPan = useCallback(
    (_event: PointerEvent, info: PanInfo) => {
      if (!enabled || ignorePanRef.current || !draggingRef.current) return;
      applyHorizontalDelta(info.delta.x, pointerGain(pointerTypeRef.current));
    },
    [enabled, applyHorizontalDelta],
  );

  const onPanEnd = useCallback(() => {
    if (!ignorePanRef.current && enabled) {
      snapSectionToNearestStep(sectionRef, stageRef.current, stepCount);
    }
    ignorePanRef.current = false;
    draggingRef.current = false;
    setIsDragging(false);
  }, [enabled, sectionRef, stepCount]);

  return {
    stageRef,
    onPanStart,
    onPan,
    onPanEnd,
    showHint: enabled && showHint,
    showVerticalHint: enabled && showVerticalHint,
    dismissHint,
    isDragging,
  };
}
