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

function dragGain(pointerType?: string): number {
  if (pointerType === "touch" || pointerType === "pen") {
    return SCROLL_LINKED_MOBILE_DRAG_FACTOR;
  }
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return SCROLL_LINKED_MOBILE_DRAG_FACTOR;
  }
  return SCROLL_LINKED_DRAG_FACTOR;
}

/**
 * Nudge vertical scroll — sticky sections map scroll → horizontal motion.
 * Relative delta keeps manual drag in sync with native Lenis momentum on vertical scroll.
 */
function scrollByDelta(dy: number): void {
  if (!dy) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(lenis.scroll + dy, { immediate: true });
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
  const pointerTypeRef = useRef<string>("mouse");
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

  const onPanStart = useCallback(
    (event: PointerEvent) => {
      if (!enabled) return;
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
      const gain = dragGain(pointerTypeRef.current);
      scrollByDelta(-info.delta.x * gain);
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
