"use client";

import type { PanInfo } from "framer-motion";
import type { ReactNode, Ref } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { ScrollLinkedStageNavigation } from "@/lib/useScrollLinkedManualNavigation";
import { ScrollLinkedHorizontalHint } from "@/components/scroll-linked/ScrollLinkedHorizontalHint";

type ScrollLinkedInteractiveStageProps = {
  children: ReactNode;
  stageNavigation: ScrollLinkedStageNavigation | null;
  className?: string;
};

/**
 * Wraps the scroll-linked sticky stage. Horizontal grab / swipe / trackpad gestures
 * are translated into vertical scroll (see useScrollLinkedManualNavigation) — the stage
 * itself never transforms, so clickable cards still work and there is no jump/snap.
 */
export function ScrollLinkedInteractiveStage({
  children,
  stageNavigation,
  className,
}: ScrollLinkedInteractiveStageProps) {
  if (!stageNavigation) {
    return <div className={className}>{children}</div>;
  }

  const { stageRef, onPanStart, onPan, onPanEnd, showHint, isDragging } =
    stageNavigation;

  return (
    <motion.div
      ref={stageRef as Ref<HTMLDivElement>}
      className={clsx(
        className,
        // select-none: grab-dragging must never highlight card text/images
        "relative touch-pan-y select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onPanStart={(event) => onPanStart(event as PointerEvent)}
      onPan={(event, info: PanInfo) => onPan(event as PointerEvent, info)}
      onPanEnd={onPanEnd}
    >
      {children}
      {showHint ? <ScrollLinkedHorizontalHint /> : null}
    </motion.div>
  );
}
