"use client";

import type { ReactNode } from "react";
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
 * Wraps scroll-linked sticky stage — pan-x drag + horizontal wheel when navigation is enabled.
 */
export function ScrollLinkedInteractiveStage({
  children,
  stageNavigation,
  className,
}: ScrollLinkedInteractiveStageProps) {
  if (!stageNavigation) {
    return <div className={className}>{children}</div>;
  }

  const { stageRef, onPan, onPanEnd, showHint, isDragging } = stageNavigation;

  return (
    <motion.div
      ref={stageRef}
      className={clsx(
        className,
        "relative touch-pan-y",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
      drag="x"
      dragElastic={0}
      dragMomentum={false}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={(_event, info) => onPan(_event as unknown as PointerEvent, info)}
      onDragEnd={onPanEnd}
    >
      {children}
      {showHint ? <ScrollLinkedHorizontalHint /> : null}
    </motion.div>
  );
}
