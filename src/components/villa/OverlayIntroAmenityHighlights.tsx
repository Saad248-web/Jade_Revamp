"use client";

import type { LucideIcon } from "lucide-react";
import { splitAmenityLabel } from "@/lib/villaDetailIcons";
import AmenityHighlightTile from "./AmenityHighlightTile";
import { VILLA_DETAIL_SPACING } from "./villaDetailSpacing";

const vd = VILLA_DETAIL_SPACING;

type AmenityLike = { icon?: string; label?: string };

type Props = {
  amenities: AmenityLike[];
  getIcon: (iconName?: string, title?: string) => LucideIcon;
};

export default function OverlayIntroAmenityHighlights({
  amenities,
  getIcon,
}: Props) {
  if (!amenities?.length) return null;

  return (
    <div
      className={
        `${vd.amenityHighlightViewportShell} ` +
        `${vd.amenityHighlightViewportEdge} ` +
        `${vd.amenityHighlightViewportInset}`
      }
    >
      <div
        className={vd.amenityHighlightTrackFullBleed}
        data-lenis-prevent-touch
        data-jade-hscroll
      >
        {amenities.map((amenity, idx) => {
          const IconComponent = getIcon(amenity.icon, amenity.label);
          const { line1, line2 } = splitAmenityLabel(amenity.label ?? "");
          return (
            <AmenityHighlightTile
              key={idx}
              icon={IconComponent}
              label={line1}
              sublabel={line2 || null}
            />
          );
        })}
      </div>
    </div>
  );
}
