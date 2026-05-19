"use client";

import { ArrowRight } from "lucide-react";
import type { VillaAmenity } from "@/lib/types";
import { getVillaDetailIcon, splitAmenityLabel } from "@/lib/villaDetailIcons";
import VillaDetailSection from "./VillaDetailSection";
import { VillaDetailSectionHeading } from "./VillaDetailSection";
type Props = {
  amenities: VillaAmenity[];
  onSeeMore: () => void;
  previewCount?: number;
};

export default function VillaDetailAmenityGrid({
  amenities,
  onSeeMore,
  previewCount = 8,
}: Props) {
  if (!amenities?.length) return null;

  return (
    <VillaDetailSection id="amenities" variant="charcoal" meanderBottom meanderBottomAccent="green">
      <VillaDetailSectionHeading>Amenities</VillaDetailSectionHeading>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8">
        {amenities.slice(0, previewCount).map((amenity, idx) => {
          const Icon = getVillaDetailIcon(amenity.icon);
          const { line1, line2 } = splitAmenityLabel(amenity.label);
          return (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-10 h-10 shrink-0 border border-[#EFCD62]/70 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#EFCD62]" strokeWidth={1} />
              </div>
              <div className="text-white font-manrope text-sm leading-snug pt-1">
                <span className="block">{line1}</span>
                {line2 ? <span className="block">{line2}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
      {amenities.length > previewCount ? (
        <button
          type="button"
          onClick={onSeeMore}
          className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
        >
          SEE MORE <ArrowRight className="w-3 h-3" />
        </button>
      ) : null}
    </VillaDetailSection>
  );
}
