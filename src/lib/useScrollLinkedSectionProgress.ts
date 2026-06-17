"use client";

import { useRef } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useSnappedScrollProgress } from "@/lib/carouselMotion";
import {
  SCROLL_LINKED_FREE_SCROLL_GAIN,
} from "@/lib/scrollLinkedFreeScroll";
import {
  useScrollLinkedManualNavigation,
  type ScrollLinkedStageNavigation,
} from "@/lib/useScrollLinkedManualNavigation";
import { useMediaMinLg } from "@/lib/useMediaMinLg";

export type ScrollLinkedScrollMode = "free" | "mobileSnapOnly";

export type UseScrollLinkedSectionProgressOptions = {
  scrollMode?: ScrollLinkedScrollMode;
  stepCount?: number;
  smoothSpring?: boolean;
  /** Mobile snap only — lower = less vertical scroll before the next card snaps in */
  mobileSnapDwellRatio?: number;
  /** Mobile snap — amplified scroll + optional light dwell */
  mobileSnapAggressive?: boolean;
  /** Passed to aggressive snap (default scrollGain 2.1) */
  mobileSnapScrollGain?: number;
  /** Share of section scroll used for card snaps; remainder is exit runway to next section */
  mobileSnapZoneRatio?: number;
  /** Cap snapped progress so horizontal carousel stops at last card (Featured CTA) */
  mobileSnapMaxProgress?: number;
  /** Free / desktop scroll-linked — vertical scroll → horizontal gain */
  freeScrollGain?: number;
  /** Manual swipe/drag + horizontal wheel (default: free mode, or desktop when mobileSnapOnly) */
  enableManualNavigation?: boolean;
  /** Show swipe/drag hint on first visit to section */
  showHorizontalHint?: boolean;
};

export type UseScrollLinkedSectionProgressResult = {
  targetRef: React.RefObject<HTMLElement | null>;
  panelProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  stageNavigation: ScrollLinkedStageNavigation | null;
};

export function useScrollLinkedSectionProgress(
  options: UseScrollLinkedSectionProgressOptions = {},
): UseScrollLinkedSectionProgressResult {
  const {
    scrollMode = "free",
    stepCount = 2,
    smoothSpring = false,
    mobileSnapDwellRatio = 0.32,
    mobileSnapAggressive = false,
    mobileSnapScrollGain = 2.1,
    mobileSnapZoneRatio = 0.68,
    mobileSnapMaxProgress,
    freeScrollGain = SCROLL_LINKED_FREE_SCROLL_GAIN,
    enableManualNavigation,
    showHorizontalHint = true,
  } = options;

  const mobileSnapDwell =
    mobileSnapAggressive && mobileSnapDwellRatio === 0.32
      ? 0.12
      : mobileSnapDwellRatio;

  const targetRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isLg = useMediaMinLg();
  const { scrollYProgress } = useScroll({ target: targetRef });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: smoothSpring ? 70 : 100,
    damping: smoothSpring ? 24 : 30,
    mass: smoothSpring ? 0.6 : 1,
    restDelta: 0.001,
  });

  const mobileSnapActive = scrollMode === "mobileSnapOnly" && !isLg;
  const freeNavActive =
    scrollMode === "free" || (scrollMode === "mobileSnapOnly" && isLg);
  const manualNavEnabled =
    enableManualNavigation ?? freeNavActive;

  const useSmoothInput = smoothSpring && !mobileSnapActive;
  const inputProgress = useSmoothInput ? smoothProgress : scrollYProgress;

  const amplifiedInput = useTransform(inputProgress, (p) => {
    if (!mobileSnapAggressive) return p;
    if (p >= mobileSnapZoneRatio) return 1;
    const t = p / mobileSnapZoneRatio;
    return Math.min(1, t * mobileSnapScrollGain);
  });

  const snapInput =
    mobileSnapActive && mobileSnapAggressive ? amplifiedInput : inputProgress;

  const dwellProgress = useSnappedScrollProgress(
    snapInput,
    stepCount,
    reducedMotion,
    mobileSnapActive ? mobileSnapDwell : 0.32,
  );

  const snappedProgress = useSpring(dwellProgress, {
    stiffness: mobileSnapActive ? (mobileSnapAggressive ? 175 : 200) : 120,
    damping: mobileSnapActive ? (mobileSnapAggressive ? 36 : 24) : 26,
    mass: mobileSnapActive ? (mobileSnapAggressive ? 0.4 : 0.35) : 0.5,
    restDelta: mobileSnapAggressive ? 0.0008 : 0.0005,
  });

  const cappedSnapProgress = useTransform(snappedProgress, (p) => {
    if (!mobileSnapActive || mobileSnapMaxProgress == null) return p;
    return Math.min(p, mobileSnapMaxProgress);
  });

  const legacyFreeProgress = useTransform(scrollYProgress, (p) =>
    Math.min(1, Math.max(0, p * freeScrollGain)),
  );

  const stageNavigation = useScrollLinkedManualNavigation({
    targetRef,
    scrollYProgress,
    enabled: manualNavEnabled,
    scrollGain: freeScrollGain,
    showHint: showHorizontalHint,
  });

  const panelProgress: MotionValue<number> = mobileSnapActive
    ? cappedSnapProgress
    : manualNavEnabled
      ? stageNavigation.panelProgress
      : legacyFreeProgress;

  return {
    targetRef,
    panelProgress,
    scrollYProgress,
    stageNavigation: manualNavEnabled ? stageNavigation : null,
  };
}
