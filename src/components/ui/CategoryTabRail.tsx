"use client";

import clsx from "clsx";
import { forwardRef, type ReactNode } from "react";
import HorizontalScrollRail from "@/components/ui/HorizontalScrollRail";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";

const vd = VILLA_DETAIL_SPACING;

/** Marks horizontal category / section tab bars for touch + Lenis assurance. */
export const JADE_TAB_RAIL_DATA_ATTR = "data-jade-tab-rail" as const;

/** Shared track spacing — 8pt gutters; mobile inner gutter via jade-hscroll-track--mobile-gutter */
export const CATEGORY_TAB_TRACK_CLASSES =
  "gap-2 xs:gap-2.5 sm:gap-3 py-3 sm:py-4 scrollbar-none overscroll-x-contain sm:scroll-pl-[max(1rem,env(safe-area-inset-left,0px))] sm:scroll-pr-[max(2.5rem,env(safe-area-inset-right,0px))] sm:scroll-pr-10";

export type CategoryTabRailProps = {
  children: ReactNode;
  /** Outer shell (sticky chrome, padding wrappers). */
  className?: string;
  trackClassName?: string;
  fadeFrom?: string;
  showFade?: boolean;
  patternFade?: boolean;
  /** Mobile: viewport edge-to-edge shell (tab bar chrome full width). */
  mobileViewportEdge?: boolean;
  /** Mobile: 16px inner track gutter; defaults on when mobileViewportEdge is true. */
  mobileTrackGutter?: boolean;
  /** When true, outer shell uses jade-hscroll-chrome (no layout contain). */
  withChrome?: boolean;
  /**
   * amenityParity — overlay category bar: same track layout as AmenityHighlightTile row
   * (gap-4, snap-x, amenity-highlight-track--responsive).
   */
  trackPreset?: "category" | "amenityParity";
  trackAriaLabel?: string;
};

const CategoryTabRail = forwardRef<HTMLDivElement, CategoryTabRailProps>(
  function CategoryTabRail(
    {
      children,
      className,
      trackClassName,
      fadeFrom = "#1A1C1E",
      showFade = true,
      patternFade = false,
      mobileViewportEdge = false,
      mobileTrackGutter,
      withChrome = false,
      trackPreset = "category",
      trackAriaLabel,
    },
    ref,
  ) {
    const useMobileGutter = mobileTrackGutter ?? mobileViewportEdge;
    const amenityParityTrack =
      trackPreset === "amenityParity"
        ? vd.overlayCategoryRailTrack
        : null;

    return (
      <div
        {...{ [JADE_TAB_RAIL_DATA_ATTR]: "" }}
        className={clsx(
          "jade-tab-rail relative min-w-0 w-full",
          withChrome && "jade-hscroll-chrome",
          mobileViewportEdge && vd.hScrollViewportEdge,
          className,
        )}
      >
        <HorizontalScrollRail
          ref={ref}
          fadeFrom={fadeFrom}
          showFade={showFade}
          patternFade={patternFade}
          trackRole="tablist"
          trackAriaLabel={trackAriaLabel}
          trackClassName={clsx(
            trackPreset === "category" && CATEGORY_TAB_TRACK_CLASSES,
            trackPreset === "category" && useMobileGutter && vd.hScrollTrackMobileGutter,
            amenityParityTrack,
            trackClassName,
          )}
        >
          {children}
        </HorizontalScrollRail>
      </div>
    );
  },
);

export default CategoryTabRail;
