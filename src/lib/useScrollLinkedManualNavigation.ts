"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PanInfo } from "framer-motion";
import { getLenis } from "@/lib/lenis";
import {
  SCROLL_LINKED_DRAG_FACTOR,
  SCROLL_LINKED_MOBILE_DRAG_FACTOR,
  SCROLL_LINKED_WHEEL_FACTOR,
} from "@/lib/scrollLinkedFreeScroll";

export type UseScrollLinkedManualNavigationOptions = {
  enabled: boolean;
  showHint?: boolean;
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

/** Elements (e.g. image carousels) that own their own horizontal swipe opt out via this attribute. */
const NO_PAN_SELECTOR = "[data-jade-stage-no-pan]";

const TOUCH_AXIS_LOCK_PX = 6;

function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function dragGain(): number {
  return isCoarsePointer()
    ? SCROLL_LINKED_MOBILE_DRAG_FACTOR
    : SCROLL_LINKED_DRAG_FACTOR;
}

/**
 * Apply a relative vertical scroll delta — these sticky sections map vertical
 * scroll → horizontal motion, so manual horizontal gestures just nudge the scroll.
 */
function scrollByDelta(dy: number): void {
  if (!dy) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(lenis.scroll + dy, { immediate: true, force: true });
  } else {
    window.scrollBy(0, dy);
  }
}

export function useScrollLinkedManualNavigation({
  enabled,
  showHint: showHintOption = true,
}: UseScrollLinkedManualNavigationOptions): ScrollLinkedStageNavigation {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const ignorePanRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(enabled && showHintOption);

  const dismissHint = useCallback(() => setShowHint(false), []);

  // Horizontal wheel / two-finger trackpad → vertical scroll (forward = swipe left).
  useEffect(() => {
    if (!enabled) return;
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX <= absY) return;
      event.preventDefault();
      scrollByDelta(event.deltaX * SCROLL_LINKED_WHEEL_FACTOR);
      dismissHint();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [enabled, dismissHint]);

  // Mobile finger swipe — native touch path (more reliable than pointer pan on iOS).
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
      draggingRef.current = false;
      setIsDragging(false);
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
      scrollByDelta(-step * dragGain());
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
  }, [enabled, dismissHint]);

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
      draggingRef.current = true;
      setIsDragging(true);
      dismissHint();
    },
    [enabled, dismissHint],
  );

  const onPan = useCallback(
    (_event: PointerEvent, info: PanInfo) => {
      if (!enabled || ignorePanRef.current || !draggingRef.current) return;
      scrollByDelta(-info.delta.x * dragGain());
    },
    [enabled],
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
