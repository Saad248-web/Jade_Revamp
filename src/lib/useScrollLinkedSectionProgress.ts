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
  useScrollLinkedManualNavigation,
  type ScrollLinkedStageNavigation,
} from "@/lib/useScrollLinkedManualNavigation";
import { useMediaMinLg } from "@/lib/useMediaMinLg";
import { SCROLL_LINKED_FREE_MOBILE_PROGRESS_GAIN } from "@/lib/scrollLinkedFreeScroll";

export type ScrollLinkedScrollMode = "free" | "mobileSnapOnly";

export type UseScrollLinkedSectionProgressOptions = {
  scrollMode?: ScrollLinkedScrollMode;
  /** Panel steps (cards + end CTA) — used for swipe distance scaling */
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
  /** Manual swipe/drag + horizontal wheel navigation (default: on for all sections) */
  enableManualNavigation?: boolean;
  /** Show swipe/drag hint while the section is first explored */
  showHorizontalHint?: boolean;
  /** End-of-section vertical scroll cue (default on even when horizontal hint is off) */
  showVerticalHint?: boolean;
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
    enableManualNavigation,
    showHorizontalHint = true,
    showVerticalHint = true,
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
  const mobileFreeSnapActive = scrollMode === "free" && !isLg && !mobileSnapActive;
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

  const freeProgressInput = useTransform(scrollYProgress, (p) => {
    if (isLg || mobileSnapActive) return p;
    return Math.min(1, p * SCROLL_LINKED_FREE_MOBILE_PROGRESS_GAIN);
  });

  const freeSnappedInput = useSnappedScrollProgress(
    freeProgressInput,
    stepCount,
    reducedMotion,
    mobileFreeSnapActive ? 0.1 : 0.32,
  );

  const freeSnappedSpring = useSpring(freeSnappedInput, {
    stiffness: mobileFreeSnapActive ? 220 : 120,
    damping: mobileFreeSnapActive ? 30 : 26,
    mass: mobileFreeSnapActive ? 0.38 : 0.5,
    restDelta: 0.0006,
  });

  /** Free sections track scroll directly; snap sections use the snapped pipeline. */
  const panelProgress: MotionValue<number> = mobileSnapActive
    ? cappedSnapProgress
    : mobileFreeSnapActive
      ? freeSnappedSpring
      : freeProgressInput;

  const manualNavEnabled = enableManualNavigation ?? true;

  const stageNavigation = useScrollLinkedManualNavigation({
    enabled: manualNavEnabled,
    showHint: showHorizontalHint,
    showVerticalHint,
    sectionRef: targetRef,
    stepCount,
  });

  return {
    targetRef,
    panelProgress,
    scrollYProgress,
    stageNavigation: manualNavEnabled ? stageNavigation : null,
  };
}
