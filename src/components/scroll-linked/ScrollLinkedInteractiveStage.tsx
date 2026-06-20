"use client";

import type { PanInfo } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { ReactNode, Ref } from "react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { ScrollLinkedStageNavigation } from "@/lib/useScrollLinkedManualNavigation";
import { ScrollLinkedHorizontalHint } from "@/components/scroll-linked/ScrollLinkedHorizontalHint";
import { ScrollLinkedVerticalHint } from "@/components/scroll-linked/ScrollLinkedVerticalHint";

const END_ZONE_PROGRESS = 0.82;

type ScrollLinkedInteractiveStageProps = {
  children: ReactNode;
  stageNavigation: ScrollLinkedStageNavigation | null;
  className?: string;
  panelProgress?: MotionValue<number>;
};

type StageShellProps = {
  children: ReactNode;
  className?: string;
  stageNavigation: ScrollLinkedStageNavigation;
  panelProgress?: MotionValue<number>;
};

function ScrollLinkedInteractiveStageShell({
  children,
  className,
  stageNavigation,
  panelProgress,
}: StageShellProps) {
  const {
    stageRef,
    onPanStart,
    onPan,
    onPanEnd,
    showHint,
    showVerticalHint,
    dismissHint,
    isDragging,
  } = stageNavigation;

  const [inEndZone, setInEndZone] = useState(false);

  useEffect(() => {
    if (!panelProgress) return;
    const onChange = (value: number) => {
      const enteringEnd = value >= END_ZONE_PROGRESS;
      setInEndZone(enteringEnd);
      if (enteringEnd) {
        dismissHint();
      }
    };
    onChange(panelProgress.get());
    return panelProgress.on("change", onChange);
  }, [panelProgress, dismissHint]);

  return (
    <motion.div
      ref={stageRef as Ref<HTMLDivElement>}
      className={clsx(
        className,
        "relative touch-pan-y select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onPanStart={(event) => onPanStart(event as PointerEvent)}
      onPan={(event, info: PanInfo) => onPan(event as PointerEvent, info)}
      onPanEnd={onPanEnd}
    >
      {children}
      {showHint && !inEndZone ? <ScrollLinkedHorizontalHint /> : null}
      {showVerticalHint && inEndZone ? <ScrollLinkedVerticalHint /> : null}
    </motion.div>
  );
}

/**
 * Wraps the scroll-linked sticky stage. Horizontal grab / swipe / trackpad gestures
 * are translated into vertical scroll (see useScrollLinkedManualNavigation) — the stage
 * itself never transforms, so clickable cards still work and there is no jump/snap.
 */
export function ScrollLinkedInteractiveStage({
  children,
  stageNavigation,
  className,
  panelProgress,
}: ScrollLinkedInteractiveStageProps) {
  if (!stageNavigation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <ScrollLinkedInteractiveStageShell
      className={className}
      stageNavigation={stageNavigation}
      panelProgress={panelProgress}
    >
      {children}
    </ScrollLinkedInteractiveStageShell>
  );
}
