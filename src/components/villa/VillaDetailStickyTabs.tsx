"use client";

import clsx from "clsx";
import { stickyCategoryTabClass } from "@/lib/stickyTabGlass";
import { VILLA_DETAIL_STICKY_TABS_CHROME_CLASS } from "@/lib/scrollChromeGlass";
import { VILLA_DETAIL_ACTION_STICKY_TOP_VISIBLE_CLASS } from "@/lib/scrollChromeLayout";
import { useBatchedScrollHide } from "@/lib/useBatchedScrollHide";
import { useScrollTabIntoView } from "@/lib/useScrollTabIntoView";
import CategoryTabRail from "@/components/ui/CategoryTabRail";
import MeanderStrip from "@/components/ui/MeanderStrip";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";
const vd = VILLA_DETAIL_SPACING;

const TAB_LABELS = [
  "Spaces",
  "Experiences",
  "Details",
  "Video Walkthrough",
  "Services",
  "Amenities",
  "Pricing",
  "Location",
  "Perfect For",
  "FAQ",
] as const;

function tabToSectionId(tab: string): string {
  if (tab === "Details") return "details";
  return tab.toLowerCase().replace(/ /g, "-");
}

type VillaDetailStickyTabsProps = {
  activeTab: string;
  onTabClick: (sectionId: string) => void;
  /** Sections present in the DOM — tabs for missing sections are hidden. */
  sectionIds?: readonly string[];
};

export default function VillaDetailStickyTabs({
  activeTab,
  onTabClick,
  sectionIds,
}: VillaDetailStickyTabsProps) {
  const trackRef = useScrollTabIntoView(activeTab);
  const actionChromeHidden = useBatchedScrollHide();

  const visibleTabs = TAB_LABELS.filter((tab) => {    const sectionId = tabToSectionId(tab);
    return sectionIds ? sectionIds.includes(sectionId) : true;
  });

  return (
    <>
      {/* Greek-key band — static in document flow (scrolls away); tabs alone stay sticky */}
      <MeanderStrip layout="pageGutter" track="charcoal" className="relative z-40" />
      <div
        className={clsx(
          "jade-hscroll-chrome sticky z-40 w-full",
          actionChromeHidden ? "top-0" : VILLA_DETAIL_ACTION_STICKY_TOP_VISIBLE_CLASS,
          vd.hScrollViewportEdge,
        )}
      >        <div className={vd.stickyChromeShell}>
          <div className={VILLA_DETAIL_STICKY_TABS_CHROME_CLASS}>
            <CategoryTabRail
            ref={trackRef}
            fadeFrom="#1A1C1E"
            patternFade
            mobileTrackGutter
            trackAriaLabel="Villa sections"
          >
          {visibleTabs.map((tab) => {
            const sectionId = tabToSectionId(tab);
            const isActive = activeTab === sectionId;
            return (
              <button
                key={tab}
                type="button"
                data-tab-key={sectionId}
                onClick={() => onTabClick(sectionId)}
                className={clsx(
                  stickyCategoryTabClass(isActive),
                  "flex-shrink-0",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                {tab === "Details" ? "Property Details" : tab}
              </button>
            );
          })}
            </CategoryTabRail>
          </div>
        </div>
      </div>
    </>
  );
}
