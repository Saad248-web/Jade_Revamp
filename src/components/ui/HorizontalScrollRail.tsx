"use client";

import clsx from "clsx";
import { forwardRef, type AriaRole, type ReactNode } from "react";
import LuxuryPattern from "@/components/LuxuryPattern";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";
import { JADE_HSCROLL_DATA_ATTR } from "@/lib/horizontalScrollClasses";

const vd = VILLA_DETAIL_SPACING;

export type HorizontalScrollRailProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Background color for right-edge fade (match section bg). */
  fadeFrom?: string;
  showFade?: boolean;
  /** ~60px extreme charcoal-glass blur fade + pattern on the right edge (category bars). */
  patternFade?: boolean;
  /** Mobile: viewport edge-to-edge (same as AmenityHighlightTile row). */
  mobileViewportEdge?: boolean;
  /** Mobile: 16px scroll padding + trailing spacer on the track. */
  mobileTrackGutter?: boolean;
  trackRole?: AriaRole;
  trackAriaLabel?: string;
};

const HorizontalScrollRail = forwardRef<HTMLDivElement, HorizontalScrollRailProps>(
  function HorizontalScrollRail(
    {
      children,
      className,
      trackClassName,
      fadeFrom = "#1A1C1E",
      showFade = true,
      patternFade = false,
      mobileViewportEdge = false,
      mobileTrackGutter = false,
      trackRole,
      trackAriaLabel,
    },
    ref,
  ) {
    return (
      <div
        className={clsx(
          "relative min-w-0 w-full",
          mobileViewportEdge && vd.hScrollViewportEdge,
          className,
        )}
      >
        <div
          ref={ref}
          role={trackRole}
          aria-label={trackAriaLabel}
          {...{ [JADE_HSCROLL_DATA_ATTR]: "" }}
          className={clsx(
            "jade-hscroll-track flex overflow-x-auto min-w-0 overscroll-x-contain",
            mobileTrackGutter && vd.hScrollTrackMobileGutter,
            trackClassName,
          )}
        >
          {children}
        </div>
        {showFade ? (
          <div
            aria-hidden
            className={clsx(
              "jade-hscroll-fade",
              patternFade
                ? "jade-hscroll-fade--grey-white jade-hscroll-fade--pattern"
                : "backdrop-blur-sm",
            )}
            style={
              patternFade
                ? undefined
                : {
                    background: `linear-gradient(to left, ${fadeFrom} 0%, ${fadeFrom}e6 40%, transparent 100%)`,
                  }
            }
          >
            {patternFade ? (
              <div className="jade-hscroll-fade__pattern" aria-hidden>
                <LuxuryPattern
                  patternSize={120}
                  opacity={1}
                  className="absolute inset-0 h-full w-[200%] max-w-none"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

export default HorizontalScrollRail;
