"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { scrollToY } from "@/lib/lenis";
import {
  SCROLL_LINKED_FREE_DRAG_VIEWPORT_RATIO,
  SCROLL_LINKED_FREE_SCROLL_GAIN,
  SCROLL_LINKED_FREE_WHEEL_GAIN,
  scrollProgressFromSectionScroll,
  scrollTopForPanelProgress,
} from "@/lib/scrollLinkedFreeScroll";

export type UseScrollLinkedManualNavigationOptions = {
  targetRef: React.RefObject<HTMLElement | null>;
  scrollYProgress: MotionValue<number>;
  enabled: boolean;
  scrollGain?: number;
  showHint?: boolean;
};

export type ScrollLinkedStageNavigation = {
  panelProgress: MotionValue<number>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onPan: (_event: PointerEvent, info: PanInfo) => void;
  onPanEnd: () => void;
  showHint: boolean;
  dismissHint: () => void;
  isDragging: boolean;
};

export function useScrollLinkedManualNavigation({
  targetRef,
  scrollYProgress,
  enabled,
  scrollGain = SCROLL_LINKED_FREE_SCROLL_GAIN,
  showHint: showHintOption = true,
}: UseScrollLinkedManualNavigationOptions): ScrollLinkedStageNavigation {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const progressMotion = useMotionValue(0);
  /** Direct progress — no spring so card frames stay locked to scroll/drag input. */
  const panelProgress = progressMotion;
  const [showHint, setShowHint] = useState(enabled && showHintOption);
  const [isDragging, setIsDragging] = useState(false);

  const dismissHint = useCallback(() => {
    setShowHint(false);
  }, []);

  const syncScrollFromProgress = useCallback(
    (progress: number, immediate = false) => {
      const el = targetRef.current;
      if (!el) return;
      const top = scrollTopForPanelProgress(el, progress, scrollGain);
      if (top == null) return;
      scrollToY(top, { immediate });
    },
    [targetRef, scrollGain],
  );

  const applyHorizontalDelta = useCallback(
    (deltaX: number) => {
      const vw = window.innerWidth || 1;
      const deltaProgress =
        (-deltaX / vw) * (1 / SCROLL_LINKED_FREE_DRAG_VIEWPORT_RATIO);
      const next = Math.min(
        1,
        Math.max(0, progressMotion.get() + deltaProgress),
      );
      progressMotion.set(next);
      syncScrollFromProgress(next, true);
      dismissHint();
    },
    [progressMotion, syncScrollFromProgress, dismissHint],
  );

  useEffect(() => {
    if (!enabled) return;
    return scrollYProgress.on("change", (p) => {
      if (draggingRef.current) return;
      const next = scrollProgressFromSectionScroll(p, scrollGain);
      progressMotion.set(next);
      if (next > 0.04) dismissHint();
    });
  }, [enabled, scrollYProgress, progressMotion, scrollGain, dismissHint]);

  useEffect(() => {
    if (!enabled) return;
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX <= absY * 0.55 && absX < 2) return;

      event.preventDefault();
      const delta = absX >= absY * 0.55 ? event.deltaX : event.deltaY;
      applyHorizontalDelta(delta * SCROLL_LINKED_FREE_WHEEL_GAIN * 100);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [enabled, applyHorizontalDelta]);

  const onPan = useCallback(
    (_event: PointerEvent, info: PanInfo) => {
      if (!enabled) return;
      if (!draggingRef.current) {
        draggingRef.current = true;
        setIsDragging(true);
      }
      applyHorizontalDelta(info.delta.x);
    },
    [enabled, applyHorizontalDelta],
  );

  const onPanEnd = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!enabled || !showHint) return;
    const timer = window.setTimeout(dismissHint, 7000);
    return () => window.clearTimeout(timer);
  }, [enabled, showHint, dismissHint]);

  return {
    panelProgress,
    stageRef,
    onPan,
    onPanEnd,
    showHint: enabled && showHint,
    dismissHint,
    isDragging,
  };
}
