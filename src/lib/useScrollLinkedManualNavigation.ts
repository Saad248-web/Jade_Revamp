"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PanInfo } from "framer-motion";
import { getLenis } from "@/lib/lenis";
import {
  SCROLL_LINKED_DRAG_FACTOR,
  SCROLL_LINKED_MOBILE_DRAG_FACTOR,
  SCROLL_LINKED_WHEEL_FACTOR,
  horizontalDragToScrollDelta,
} from "@/lib/scrollLinkedFreeScroll";

export type UseScrollLinkedManualNavigationOptions = {
  enabled: boolean;
  showHint?: boolean;
  sectionRef?: React.RefObject<HTMLElement | null>;
  /** Panel steps in the section (cards + end CTA) — drives swipe distance per card */
  stepCount?: number;
};

export type ScrollLinkedStageNavigation = {
  stageRef: React.RefObject<HTMLDivElement | null>;
  onPanStart: (event: PointerEvent) => void;
  onPan: (event: PointerEvent, info: PanInfo) => void;
  onPanEnd: () => void;
  showHint: boolean;
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
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(lenis.scroll + dy, { immediate: true });
  } else {
    window.scrollBy(0, dy);
  }
}

function resolveSectionEl(
  sectionRef: React.RefObject<HTMLElement | null> | undefined,
  stageEl: HTMLElement | null,
): HTMLElement | null {
  if (sectionRef?.current) return sectionRef.current;
  return stageEl?.closest("section") ?? null;
}

export function useScrollLinkedManualNavigation({
  enabled,
  showHint: showHintOption = true,
  sectionRef,
  stepCount = 2,
}: UseScrollLinkedManualNavigationOptions): ScrollLinkedStageNavigation {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const ignorePanRef = useRef(false);
  const pointerTypeRef = useRef<string>("mouse");
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(enabled && showHintOption);

  const dismissHint = useCallback(() => setShowHint(false), []);

  const applyHorizontalDelta = useCallback(
    (deltaX: number, gain: number) => {
      const section = resolveSectionEl(sectionRef, stageRef.current);
      const dy = horizontalDragToScrollDelta(deltaX, section, stepCount, gain);
      scrollByDelta(dy);
    },
    [sectionRef, stepCount],
  );

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

    const onTouchEnd = () => resetTouch();

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
  }, [enabled, dismissHint, applyHorizontalDelta]);

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
    ignorePanRef.current = false;
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  return {
    stageRef,
    onPanStart,
    onPan,
    onPanEnd,
    showHint: enabled && showHint,
    dismissHint,
    isDragging,
  };
}
