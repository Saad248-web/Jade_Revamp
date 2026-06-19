"use client";

import clsx from "clsx";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { SCROLL_LINE_INDICATOR_BOTTOM_CLASS } from "@/lib/layoutSpacing";

export type ScrollLinkedHorizontalProgressProps = {
  panelProgress: MotionValue<number>;
  className?: string;
};

/**
 * Persistent horizontal scroll progress — sits above mobile bottom nav in pinned sections.
 */
export function ScrollLinkedHorizontalProgress({
  panelProgress,
  className,
}: ScrollLinkedHorizontalProgressProps) {
  const fillScale = useTransform(panelProgress, [0, 1], [0, 1]);

  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-x-0 z-[75] flex justify-center px-6",
        SCROLL_LINE_INDICATOR_BOTTOM_CLASS,
        className,
      )}
      aria-hidden
    >
      <div className="h-[2px] w-full max-w-[140px] overflow-hidden rounded-full bg-white/15">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-[#EFCD62]/85"
          style={{ scaleX: fillScale }}
        />
      </div>
    </div>
  );
}
