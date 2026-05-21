"use client";

import clsx from "clsx";
import { VILLA_DETAIL_SPACING } from "./villaDetailSpacing";
import { stickyCategoryTabClass } from "@/lib/stickyTabGlass";
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
};

export default function VillaDetailStickyTabs({
  activeTab,
  onTabClick,
}: VillaDetailStickyTabsProps) {
  const trackRef = useScrollTabIntoView(activeTab);

  return (
    <div className="jade-scroll-chrome sticky top-0 z-50 w-full">
      <div className="border-b border-white/10 bg-transparent backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div
          className={clsx(
            "w-full",
            "md:max-w-7xl md:mx-auto",
            VILLA_DETAIL_SPACING.gutterX,
            "max-md:px-0",
          )}
        >
          <div className="w-full md:max-w-4xl md:mx-auto">
            <div
              ref={trackRef}
              className="jade-hscroll-track flex gap-2 sm:gap-3 overflow-x-auto py-4 scrollbar-none overscroll-x-contain max-md:scroll-pl-0 max-md:scroll-pr-0"
            >
              {TAB_LABELS.map((tab) => {
                const sectionId = tabToSectionId(tab);
                const isActive = activeTab === sectionId;
                return (
                  <button
                    key={tab}
                    type="button"
                    data-tab-key={sectionId}
                    onClick={() => onTabClick(sectionId)}
                    className={stickyCategoryTabClass(isActive)}
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
