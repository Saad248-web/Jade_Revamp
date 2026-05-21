"use client";

import { stickyCategoryTabClass } from "@/lib/stickyTabGlass";
import { VILLA_DETAIL_STICKY_TABS_CHROME_CLASS } from "@/lib/scrollChromeGlass";
import { useScrollTabIntoView } from "@/lib/useScrollTabIntoView";

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

  const visibleTabs = TAB_LABELS.filter((tab) => {
    const sectionId = tabToSectionId(tab);
    return sectionIds ? sectionIds.includes(sectionId) : true;
  });

  return (
    <div className="jade-scroll-chrome sticky top-0 z-50 w-full">
      <div className={VILLA_DETAIL_STICKY_TABS_CHROME_CLASS}>
        <div
          className="w-full md:max-w-7xl md:mx-auto px-4 sm:px-5 lg:px-6"
        >
          <div className="w-full md:max-w-4xl md:mx-auto">
            <div
              ref={trackRef}
              data-lenis-prevent
              className="jade-hscroll-track flex gap-2 sm:gap-3 overflow-x-auto py-4 scrollbar-none overscroll-x-contain scroll-pl-0 scroll-pr-3 sm:scroll-pr-5"
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
                    className={stickyCategoryTabClass(isActive)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {tab === "Details" ? "Property Details" : tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
