"use client";

import type { ReactNode } from "react";
import HorizontalScrollRail from "@/components/ui/HorizontalScrollRail";
import ScrollLinkedFreePanelCard from "@/components/scroll-linked/ScrollLinkedFreePanelCard";
import type { ScrollLinkedPanelData } from "@/components/scroll-linked/ScrollLinkedPanelCard";

export type ScrollLinkedFreeMobileRailProps = {
  panels: ScrollLinkedPanelData[];
  endSlot?: ReactNode;
  gapVariant?: "standard" | "wide";
  ariaLabel?: string;
};

export default function ScrollLinkedFreeMobileRail({
  panels,
  endSlot,
  gapVariant = "standard",
  ariaLabel = "Experience panels",
}: ScrollLinkedFreeMobileRailProps) {
  return (
    <div className="max-w-[1920px] mx-auto w-full min-w-0">
      <HorizontalScrollRail
        mobileViewportEdge
        mobileTrackGutter
        cursorGrab
        showFade
        trackRole="list"
        trackAriaLabel={ariaLabel}
        trackClassName="snap-x snap-mandatory gap-4 pb-8 scrollbar-none scroll-pr-4 sm:scroll-pr-6"
      >
        {panels.map((panel, index) => (
          <ScrollLinkedFreePanelCard
            key={panel.id}
            data={panel}
            gapVariant={gapVariant}
            isFirst={index === 0}
          />
        ))}
        {endSlot ? (
          <div className="snap-start flex shrink-0 items-center justify-center w-[min(72vw,320px)] pr-6 sm:pr-8">
            {endSlot}
          </div>
        ) : null}
      </HorizontalScrollRail>
    </div>
  );
}
