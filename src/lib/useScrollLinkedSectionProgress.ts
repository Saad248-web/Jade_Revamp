"use client";

import { useRef } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useSnappedScrollProgress } from "@/lib/carouselMotion";
import { useMediaMinLg } from "@/lib/useMediaMinLg";

export type ScrollLinkedScrollMode = "free" | "mobileSnapOnly";

export type UseScrollLinkedSectionProgressOptions = {
  scrollMode?: ScrollLinkedScrollMode;
  stepCount?: number;
  smoothSpring?: boolean;
};

export function useScrollLinkedSectionProgress(
  options: UseScrollLinkedSectionProgressOptions = {},
) {
  const {
    scrollMode = "free",
    stepCount = 2,
    smoothSpring = false,
  } = options;

  const targetRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isLg = useMediaMinLg();
  const { scrollYProgress } = useScroll({ target: targetRef });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: smoothSpring ? 70 : 100,
    damping: smoothSpring ? 24 : 30,
    mass: smoothSpring ? 0.6 : 1,
    restDelta: 0.001,
  });

  const inputProgress = smoothSpring ? smoothProgress : scrollYProgress;

  const dwellProgress = useSnappedScrollProgress(
    inputProgress,
    stepCount,
    reducedMotion,
    0.32,
  );

  const snappedProgress = useSpring(dwellProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  const panelProgress: MotionValue<number> =
    scrollMode === "mobileSnapOnly" && !isLg ? snappedProgress : scrollYProgress;

  return { targetRef, panelProgress, scrollYProgress };
}
