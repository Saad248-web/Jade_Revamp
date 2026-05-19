"use client";

import clsx from "clsx";
import VillaDetailMeanderStrip from "./VillaDetailMeanderStrip";
import { VILLA_DETAIL_SPACING } from "./villaDetailSpacing";

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
    <div className="sticky top-0 z-50 w-full shadow-2xl">
      <VillaDetailMeanderStrip />
      <div className="bg-jade-charcoal border-b border-white/5">
        <div className={clsx(VILLA_DETAIL_SPACING.page, VILLA_DETAIL_SPACING.gutterX)}>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto py-4 scrollbar-none">
            {TAB_LABELS.map((tab) => {
              const sectionId = tabToSectionId(tab);
              const isActive = activeTab === sectionId;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabClick(sectionId)}
                  className={`shrink-0 px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold font-manrope transition-colors whitespace-nowrap ${ isActive ? "bg-[#EFCD62] text-black" : "text-white/80 hover:text-white bg-transparent" }`}
                >
                  {tab === "Details" ? "Property Details" : tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
