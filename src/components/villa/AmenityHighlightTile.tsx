"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

/**
 * Amenity “stats block” system — root 120×106 in globals.css (`--amenity-root-*`,
 * `--amenity-tile-gap-*`, `--fs-amenity-*`). 5-row grid aligns icon, title, and subtitle across tiles.
 */
export const AMENITY_HIGHLIGHT_TILE_SYSTEM = {
  rootWidthPx: 120,
  rootHeightPx: 106,
  /** Mid-tone anchor ~#505059 (see tile gradient) */
  fillRgb: "80,80,89",
} as const;

/** Shell: aspect-ratio box; gradient anchored on #505059 + blur. */
export const AMENITY_HIGHLIGHT_TILE_CLASS =
  [
    "amenity-highlight-tile relative rounded-none",
    "bg-[linear-gradient(135deg,rgba(98,98,106,0.48)_0%,rgba(80,80,89,0.58)_40%,rgba(52,52,60,0.72)_100%)]",
    "text-center shadow-none backdrop-blur-md jade-hscroll-view-item",
  ].join(" ");

type Props = {
  icon: LucideIcon;
  label: string;
  sublabel?: string | null;
  className?: string;
};

export default function AmenityHighlightTile({
  icon: Icon,
  label,
  sublabel,
  className,
}: Props) {
  const hasSublabel = Boolean(sublabel?.trim());

  return (
    <div
      className={clsx(
        AMENITY_HIGHLIGHT_TILE_CLASS,
        !hasSublabel && "amenity-highlight-tile--no-sublabel",
        className,
      )}
    >
      {/* Fixed-height row keeps every Lucide glyph on the same baseline regardless of label wrap */}
      <div className="amenity-highlight-tile__icon-row flex shrink-0 items-center justify-center">
        <Icon
          className="amenity-highlight-tile__icon shrink-0 text-white/90"
          strokeWidth={1}
          aria-hidden
        />
      </div>
      <div className="amenity-highlight-tile__copy">
        <span className="amenity-highlight-tile__label w-full min-w-0 break-words text-center font-manrope font-semibold text-white">
          {label}
        </span>
        {hasSublabel ? (
          <span className="amenity-highlight-tile__sublabel w-full min-w-0 break-words text-center font-manrope font-normal text-white/65">
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
