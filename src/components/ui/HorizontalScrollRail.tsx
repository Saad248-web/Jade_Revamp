"use client";

import clsx from "clsx";
import { forwardRef, type AriaRole, type ReactNode, useMemo, useRef } from "react";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";
import { JADE_HSCROLL_DATA_ATTR } from "@/lib/horizontalScrollClasses";

const vd = VILLA_DETAIL_SPACING;

export type HorizontalScrollRailProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** @deprecated Use section bg #1A1C1E — fade uses global Figma gradient */
  fadeFrom?: string;
  showFade?: boolean;
  /** Wider right-edge fade (category bars); no decorative pattern */
  patternFade?: boolean;
  /** Mobile: viewport edge-to-edge */
  mobileViewportEdge?: boolean;
  /** All breakpoints: 100vw bleed (spaces galleries, category nav) */
  viewportEdgeAll?: boolean;
  mobileTrackGutter?: boolean;
  /** Open-hand cursor on horizontal scroll track */
  cursorGrab?: boolean;
  trackRole?: AriaRole;
  trackAriaLabel?: string;
};

const HorizontalScrollRail = forwardRef<HTMLDivElement, HorizontalScrollRailProps>(
  function HorizontalScrollRail(
    {
      children,
      className,
      trackClassName,
      showFade = true,
      patternFade = false,
      mobileViewportEdge = false,
      viewportEdgeAll = false,
      mobileTrackGutter = false,
      cursorGrab = false,
      trackRole,
      trackAriaLabel,
    },
    ref,
  ) {
    const drag = useRef<{
      active: boolean;
      pointerId: number | null;
      startX: number;
      startScrollLeft: number;
    }>({ active: false, pointerId: null, startX: 0, startScrollLeft: 0 });

    const dragHandlers = useMemo(() => {
      if (!cursorGrab) return {};

      return {
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          // Only enable click-drag scroll for mouse pointers (trackpad wheel already works).
          if (e.pointerType !== "mouse") return;
          if (e.button !== 0) return;
          // Avoid native image/link drag interfering with scroll-drag.
          e.preventDefault();
          const el = e.currentTarget;
          drag.current.active = true;
          drag.current.pointerId = e.pointerId;
          drag.current.startX = e.clientX;
          drag.current.startScrollLeft = el.scrollLeft;
          el.setPointerCapture(e.pointerId);
          // Prevent text selection while dragging.
          document.body.style.userSelect = "none";
        },
        onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
          if (!drag.current.active) return;
          const el = e.currentTarget;
          const dx = e.clientX - drag.current.startX;
          el.scrollLeft = drag.current.startScrollLeft - dx;
        },
        onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => {
          if (!drag.current.active) return;
          drag.current.active = false;
          drag.current.pointerId = null;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          document.body.style.userSelect = "";
        },
        onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => {
          if (!drag.current.active) return;
          drag.current.active = false;
          drag.current.pointerId = null;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          document.body.style.userSelect = "";
        },
        onPointerLeave: (e: React.PointerEvent<HTMLDivElement>) => {
          if (!drag.current.active) return;
          drag.current.active = false;
          drag.current.pointerId = null;
          document.body.style.userSelect = "";
        },
      };
    }, [cursorGrab]);

    return (
      <div
        className={clsx(
          "relative min-w-0 w-full",
          viewportEdgeAll && "jade-hscroll-viewport--edge-all",
          mobileViewportEdge && !viewportEdgeAll && vd.hScrollViewportEdge,
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
            cursorGrab && "cursor-grab active:cursor-grabbing",
            trackClassName,
          )}
          {...dragHandlers}
        >
          {children}
        </div>
        {showFade ? (
          <div
            aria-hidden
            className={clsx(
              "jade-hscroll-fade",
              patternFade && "jade-hscroll-fade--wide",
            )}
          />
        ) : null}
      </div>
    );
  },
);

export default HorizontalScrollRail;
