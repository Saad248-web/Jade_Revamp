"use client";

import { useRef, type ReactNode, type Ref, RefObject } from "react";
import type { MotionValue } from "framer-motion";
import NavbarThemeTrigger from "@/components/NavbarThemeTrigger";
import ScrollLinkedFreeMobileRail from "@/components/scroll-linked/ScrollLinkedFreeMobileRail";
import type { ScrollLinkedPanelData } from "@/components/scroll-linked/ScrollLinkedPanelCard";
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
import type { ScrollLinkedStageNavigation } from "@/lib/useScrollLinkedManualNavigation";
import { useMediaMinLg } from "@/lib/useMediaMinLg";
import { ScrollLinkedInteractiveStage } from "@/components/scroll-linked/ScrollLinkedInteractiveStage";

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
  targetRef?: RefObject<HTMLElement | null>;
  panelProgress?: MotionValue<number>;
  stageNavigation?: ScrollLinkedStageNavigation | null;
  /** Featured §6 — full mobile stage height (no header row). */
  panelAreaVariant?: "default" | "featured";
  /** Mobile free mode — native horizontal rail (amenities/blog feel). */
  panels?: ScrollLinkedPanelData[];
  mobileEndSlot?: ReactNode;
  gapVariant?: "standard" | "wide";
  mobileRailAriaLabel?: string;
};

export function ScrollLinkedStickyStage({
  bgClassName,
  headerLabel,
  headerLabelClassName = "font-manrope text-gh-label tracking-[0.3em] uppercase font-semibold text-jade-gold drop-shadow-lg block",
  endButton,
  children,
  panelProgress,
  panelAreaClassName = scrollLinkedPanelAreaClass,
  stageNavigation = null,
}: {
  bgClassName: string;
  headerLabel?: string;
  headerLabelClassName?: string;
  endButton?: ReactNode | ((panelProgress: MotionValue<number>) => ReactNode);
  children: ReactNode | ((panelProgress: MotionValue<number>) => ReactNode);
  panelProgress: MotionValue<number>;
  panelAreaClassName?: string;
  stageNavigation?: ScrollLinkedStageNavigation | null;
}) {
  const resolvedEndButton =
    typeof endButton === "function" ? endButton(panelProgress) : endButton;
  const resolvedChildren =
    typeof children === "function" ? children(panelProgress) : children;

  return (
    <ScrollLinkedInteractiveStage
      stageNavigation={stageNavigation}
      className={`${scrollLinkedStickyStageClass} ${scrollLinkedStickyStageInnerClass} ${bgClassName}`}
    >
      {headerLabel ? (
        <div className={scrollLinkedSectionHeaderClass}>
          <span className={headerLabelClassName}>{headerLabel}</span>
        </div>
      ) : null}
      <div className={panelAreaClassName}>{resolvedChildren}</div>
      {resolvedEndButton}
    </ScrollLinkedInteractiveStage>
  );
}

function ScrollLinkedHorizontalSectionMobileFree({
  bgClassName,
  headerLabel,
  headerLabelClassName = "font-manrope text-gh-label tracking-[0.3em] uppercase font-semibold text-jade-gold drop-shadow-lg block",
  panels,
  mobileEndSlot,
  gapVariant = "standard",
  mobileRailAriaLabel,
}: Pick<
  ScrollLinkedHorizontalSectionProps,
  | "bgClassName"
  | "headerLabel"
  | "headerLabelClassName"
  | "panels"
  | "mobileEndSlot"
  | "gapVariant"
  | "mobileRailAriaLabel"
>) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`jade-section relative ${bgClassName}`}
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />
      {headerLabel ? (
        <div className={scrollLinkedSectionHeaderClass}>
          <span className={headerLabelClassName}>{headerLabel}</span>
        </div>
      ) : null}
      <ScrollLinkedFreeMobileRail
        panels={panels!}
        endSlot={mobileEndSlot}
        gapVariant={gapVariant}
        ariaLabel={mobileRailAriaLabel}
      />
    </section>
  );
}

function ScrollLinkedHorizontalSectionPinned({
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
  stageNavigation: externalStageNavigation,
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
  const stageNavigation =
    externalStageNavigation !== undefined
      ? externalStageNavigation
      : internal.stageNavigation;

  const stage = (
    <ScrollLinkedStickyStage
      bgClassName={bgClassName}
      headerLabel={headerLabel}
      headerLabelClassName={headerLabelClassName}
      endButton={endButton}
      panelProgress={panelProgress}
      panelAreaClassName={panelAreaClassName}
      stageNavigation={stageNavigation}
    >
      {children}
    </ScrollLinkedStickyStage>
  );

  if (embedded) {
    return stage;
  }

  return (
    <section
      ref={targetRef as Ref<HTMLElement>}
      className={`relative ${bgClassName}`}
      style={sectionHeightVh ? { height: `${sectionHeightVh}vh` } : undefined}
    >
      {stage}
    </section>
  );
}

export default function ScrollLinkedHorizontalSection(
  props: ScrollLinkedHorizontalSectionProps,
) {
  const isLg = useMediaMinLg();
  const useMobileFreeRail =
    props.scrollMode === "free" &&
    !isLg &&
    !props.embedded &&
    Boolean(props.panels?.length);

  if (useMobileFreeRail) {
    return <ScrollLinkedHorizontalSectionMobileFree {...props} />;
  }

  return <ScrollLinkedHorizontalSectionPinned {...props} />;
}
