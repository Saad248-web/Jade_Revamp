"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

/**
 * Amenity “stats block” system — 4px grid, Figma baseline 104×92 scaled up ~15%.
 * Spacing: equal edge padding 12, fixed icon row + flex copy region (icons align across tiles).
 */
export const AMENITY_HIGHLIGHT_TILE_SYSTEM = {
  widthPx: 120,
  heightPx: 106,
  padPx: 12,
  gapIconToCopyPx: 10,
  gapLabelLinesPx: 4,
  iconPx: 22,
  iconSlotPx: 28,
  /** Mid-tone anchor ~#505059 (see tile gradient) */
  fillRgb: "80,80,89",
  fontPrimaryPx: 10,
  fontSecondaryPx: 9,
} as const;

/** Shell: fixed 120×106; gradient anchored on #505059 (diag TL lighter → BR darker) + blur. */
export const AMENITY_HIGHLIGHT_TILE_CLASS =
  [
    "relative flex max-h-[106px] min-h-[106px] max-w-[120px] min-w-[120px] shrink-0 snap-start flex-col items-stretch overflow-hidden rounded-none",
    "bg-[linear-gradient(135deg,rgba(98,98,106,0.48)_0%,rgba(80,80,89,0.58)_40%,rgba(52,52,60,0.72)_100%)]",
    "p-3 text-center shadow-none backdrop-blur-md jade-hscroll-view-item",
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
  return (
    <div
      className={clsx(AMENITY_HIGHLIGHT_TILE_CLASS, className)}
    >
      {/* Fixed-height row keeps every Lucide glyph on the same baseline regardless of label wrap */}
      <div className="flex h-[28px] shrink-0 items-center justify-center">
        <Icon
          className="size-[22px] shrink-0 text-white/90"
          strokeWidth={1}
          aria-hidden
        />
      </div>
      <div className="mt-2.5 flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-1">
        <span
          className="line-clamp-2 w-full min-w-0 break-words text-center font-manrope text-[10px] font-semibold leading-snug text-white"
        >
          {label}
        </span>
        {sublabel ? (
          <span
            className="line-clamp-2 w-full min-w-0 break-words text-center font-manrope text-[9px] font-normal leading-snug text-white/65"
          >
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
