"use client";

import clsx from "clsx";
import type { VillaAmenityHighlight } from "@/lib/types";
import { getVillaDetailIcon } from "@/lib/villaDetailIcons";
import { VILLA_DETAIL_SPACING } from "./villaDetailSpacing";

const vd = VILLA_DETAIL_SPACING;

type Props = {
  highlights: VillaAmenityHighlight[];
  className?: string;
};

export default function VillaDetailAmenityHighlights({
  highlights,
  className,
}: Props) {
  if (!highlights?.length) return null;

  return (
    <div className={clsx("jade-hscroll-track", vd.hScrollTrack, "pl-6", className)}>
      {highlights.map((amenity, idx) => {
        const Icon = getVillaDetailIcon(amenity.icon);
        return (
          <div
            key={`${amenity.label}-${idx}`}
            className="relative min-w-[130px] h-[130px] md:min-w-[140px] md:h-[140px] bg-white/[0.07] backdrop-blur-[12px] flex flex-col items-center justify-between text-center px-5 py-5 rounded-none snap-start flex-shrink-0 jade-hscroll-view-item"
          >
            <Icon
              className="w-[26px] h-[26px] text-white/80 mt-1"
              strokeWidth={1}
            />
            <div className="flex flex-col items-center w-full">
              <span className="text-white font-manrope font-medium text-[15px] leading-tight text-center break-words w-full">
                {amenity.label}
              </span>
              {amenity.sublabel ? (
                <span className="text-white/60 font-manrope text-[13px] leading-tight mt-1 text-center break-words w-full">
                  {amenity.sublabel}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
