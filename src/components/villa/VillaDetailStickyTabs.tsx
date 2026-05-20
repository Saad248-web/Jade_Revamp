"use client";

import clsx from "clsx";
import { VILLA_DETAIL_SPACING } from "./villaDetailSpacing";
import { stickyCategoryTabClass } from "@/lib/stickyTabGlass";

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
  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="border-b border-white/10 bg-transparent backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div
          className={clsx(
            VILLA_DETAIL_SPACING.page,
            VILLA_DETAIL_SPACING.gutterX,
          )}
        >
          <div className={VILLA_DETAIL_SPACING.content}>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto py-4 scrollbar-none">
              {TAB_LABELS.map((tab) => {
                const sectionId = tabToSectionId(tab);
                const isActive = activeTab === sectionId;
                return (
                  <button
                    key={tab}
                    type="button"
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
