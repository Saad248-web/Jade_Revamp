"use client";

import { useRef } from "react";
import {
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
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
    mobileSnapZoneRatio = 0.68,
    mobileSnapMaxProgress,
    enableManualNavigation,
    showHorizontalHint = true,
    showVerticalHint = true,
  } = options;

  const targetRef = useRef<HTMLElement>(null);
  const isLg = useMediaMinLg();
  const { scrollYProgress } = useScroll({ target: targetRef });

  const mobileSnapActive = scrollMode === "mobileSnapOnly" && !isLg;

  /**
   * Featured-mobile snap: round raw scroll → nearest card index, then spring to it.
   * Pure rounding guarantees a card always settles dead-centre (never between two),
   * and is symmetric — a slight or long swipe, forward or reverse, snaps the same
   * smooth way. The cap stops the carousel on the final card (CTA) while the leftover
   * scroll runway exits to the next section.
   */
  const snapMaxProgress = mobileSnapMaxProgress ?? 1;
  const roundedSnapInput = useTransform(scrollYProgress, (p) => {
    const maxIndex = Math.max(1, stepCount - 1);
    const zone = mobileSnapZoneRatio > 0 ? mobileSnapZoneRatio : 1;
    const carouselP = Math.min(1, Math.max(0, p / zone));
    const snapped = Math.round(carouselP * maxIndex) / maxIndex;
    return Math.min(snapped, snapMaxProgress);
  });

  const snappedProgress = useSpring(roundedSnapInput, {
    stiffness: 200,
    damping: 30,
    mass: 0.42,
    restDelta: 0.0006,
  });

  /**
   * Free mode: cards track scroll DIRECTLY with a sensitivity boost — no spring, no
   * snap. Native mobile momentum (and Lenis on desktop) already provides the smooth
   * drift, so there is zero added lag — it never feels sticky or rubber-banded, just
   * a responsive, slightly-faster-than-1:1 drift.
   */
  const freeProgressInput = useTransform(scrollYProgress, (p) => {
    if (isLg || mobileSnapActive) return p;
    return Math.min(1, p * SCROLL_LINKED_FREE_MOBILE_PROGRESS_GAIN);
  });

  /** Featured-mobile snaps to centred cards; free sections drift directly with scroll. */
  const panelProgress: MotionValue<number> = mobileSnapActive
    ? snappedProgress
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
