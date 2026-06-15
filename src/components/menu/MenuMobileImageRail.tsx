"use client";

import { useRef, type ReactNode } from "react";
import { JADE_HSCROLL_DATA_ATTR } from "@/lib/horizontalScrollClasses";
import { useNestedHorizontalTouchScroll } from "@/lib/useNestedHorizontalTouchScroll";

/** Menu mobile — constrained width shell + axis-locked finger drag on image row. */
export function MenuMobileImageRail({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useNestedHorizontalTouchScroll(trackRef, true);

  return (
    <div className="menu-mobile-hscroll-shell relative w-full min-w-0">
      <div className="menu-hscroll-fade relative w-full min-w-0 overflow-hidden">
        <div
          ref={trackRef}
          {...{ [JADE_HSCROLL_DATA_ATTR]: "" }}
          className="jade-hscroll-track flex w-full min-w-0 max-w-full snap-x snap-proximity gap-2 overflow-x-auto scroll-pl-6 pl-6 pr-4 pb-1 scrollbar-none hide-scrollbar overscroll-x-contain"
        >
          {children}
        </div>
        <div
          aria-hidden
          className="jade-hscroll-fade jade-hscroll-fade--wide pointer-events-none"
        />
      </div>
    </div>
  );
}
