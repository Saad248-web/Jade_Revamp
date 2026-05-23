"use client";

import clsx from "clsx";
import type { VillaAmenityHighlight } from "@/lib/types";
import { getVillaDetailIcon } from "@/lib/villaDetailIcons";
import AmenityHighlightTile from "./AmenityHighlightTile";
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
    <div
      className={clsx(
        vd.amenityHighlightViewportShell,
        vd.amenityHighlightViewportEdge,
        vd.amenityHighlightViewportInset,
      )}
    >
      <div
        className={clsx(vd.amenityHighlightTrackFullBleed, className)}
        data-lenis-prevent-touch
        data-jade-hscroll
      >
        {highlights.map((amenity, idx) => {
          const Icon = getVillaDetailIcon(amenity.icon);
          return (
            <AmenityHighlightTile
              key={`${amenity.label}-${idx}`}
              icon={Icon}
              label={amenity.label}
              sublabel={amenity.sublabel}
            />
          );
        })}
      </div>
    </div>
  );
}
