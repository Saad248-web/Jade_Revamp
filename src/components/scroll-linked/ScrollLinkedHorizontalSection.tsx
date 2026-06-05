"use client";

import type { ReactNode, RefObject } from "react";
import type { MotionValue } from "framer-motion";
import {
  scrollLinkedPanelAreaClass,
  scrollLinkedPanelAreaFeaturedClass,
  scrollLinkedSectionHeaderClass,
  scrollLinkedStickyStageClass,
  scrollLinkedStickyStageInnerClass,
} from "@/lib/scrollLinkedPanelLayout";
import {
  useScrollLinkedSectionProgress,
  type ScrollLinkedScrollMode,
} from "@/lib/useScrollLinkedSectionProgress";

export type ScrollLinkedHorizontalSectionProps = {
  sectionHeightVh?: number;
  bgClassName: string;
  headerLabel?: string;
  headerLabelClassName?: string;
  scrollMode?: ScrollLinkedScrollMode;
  stepCount?: number;
  smoothSpring?: boolean;
  endButton?: ReactNode | ((panelProgress: MotionValue<number>) => ReactNode);
  children: ReactNode | ((panelProgress: MotionValue<number>) => ReactNode);
  /** When set, skip outer section + hook (parent owns ref/progress). */
  embedded?: boolean;
  targetRef?: RefObject<HTMLDivElement>;
  panelProgress?: MotionValue<number>;
  /** Featured §6 — full mobile stage height (no header row). */
  panelAreaVariant?: "default" | "featured";
};

export function ScrollLinkedStickyStage({
  bgClassName,
  headerLabel,
  headerLabelClassName = "font-manrope text-gh-label tracking-[0.3em] uppercase font-semibold text-jade-gold drop-shadow-lg block",
  endButton,
  children,
  panelProgress,
  panelAreaClassName = scrollLinkedPanelAreaClass,
}: {
  bgClassName: string;
  headerLabel?: string;
  headerLabelClassName?: string;
  endButton?: ReactNode | ((panelProgress: MotionValue<number>) => ReactNode);
  children: ReactNode | ((panelProgress: MotionValue<number>) => ReactNode);
  panelProgress: MotionValue<number>;
  panelAreaClassName?: string;
}) {
  const resolvedEndButton =
    typeof endButton === "function" ? endButton(panelProgress) : endButton;
  const resolvedChildren =
    typeof children === "function" ? children(panelProgress) : children;

  return (
    <div
      className={`${scrollLinkedStickyStageClass} ${scrollLinkedStickyStageInnerClass} ${bgClassName}`}
    >
      {headerLabel ? (
        <div className={scrollLinkedSectionHeaderClass}>
          <span className={headerLabelClassName}>{headerLabel}</span>
        </div>
      ) : null}
      <div className={panelAreaClassName}>{resolvedChildren}</div>
      {resolvedEndButton}
    </div>
  );
}

export default function ScrollLinkedHorizontalSection({
  sectionHeightVh,
  bgClassName,
  headerLabel,
  headerLabelClassName,
  scrollMode = "free",
  stepCount,
  smoothSpring,
  endButton,
  children,
  embedded = false,
  targetRef: externalRef,
  panelProgress: externalProgress,
  panelAreaVariant = "default",
}: ScrollLinkedHorizontalSectionProps) {
  const panelAreaClassName =
    panelAreaVariant === "featured"
      ? scrollLinkedPanelAreaFeaturedClass
      : scrollLinkedPanelAreaClass;
  const internal = useScrollLinkedSectionProgress({
    scrollMode,
    stepCount,
    smoothSpring,
  });

  const targetRef = externalRef ?? internal.targetRef;
  const panelProgress = externalProgress ?? internal.panelProgress;

  const stage = (
    <ScrollLinkedStickyStage
      bgClassName={bgClassName}
      headerLabel={headerLabel}
      headerLabelClassName={headerLabelClassName}
      endButton={endButton}
      panelProgress={panelProgress}
      panelAreaClassName={panelAreaClassName}
    >
      {children}
    </ScrollLinkedStickyStage>
  );

  if (embedded) {
    return stage;
  }

  return (
    <section
      ref={targetRef}
      className={`relative ${bgClassName}`}
      style={sectionHeightVh ? { height: `${sectionHeightVh}vh` } : undefined}
    >
      {stage}
    </section>
  );
}
