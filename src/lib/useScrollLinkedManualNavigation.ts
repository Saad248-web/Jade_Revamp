"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PanInfo } from "framer-motion";
import { getLenis } from "@/lib/lenis";
import {
  SCROLL_LINKED_DRAG_FACTOR,
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

/**
 * Apply a relative vertical scroll delta — these sticky sections map vertical
 * scroll → horizontal motion, so manual horizontal gestures just nudge the scroll.
 * Going through Lenis keeps drag/wheel/native scroll perfectly in sync (no jumps).
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
      // Only hijack clearly-horizontal gestures; vertical wheel stays with Lenis.
      if (absX <= absY) return;
      event.preventDefault();
      scrollByDelta(event.deltaX * SCROLL_LINKED_WHEEL_FACTOR);
      dismissHint();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [enabled, dismissHint]);

  const onPanStart = useCallback(
    (event: PointerEvent) => {
      if (!enabled) return;
      // Image carousels (etc.) own their horizontal swipe — let them keep the gesture.
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
      // Drag content left (delta.x < 0) → advance → scroll forward (down).
      scrollByDelta(-info.delta.x * SCROLL_LINKED_DRAG_FACTOR);
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
