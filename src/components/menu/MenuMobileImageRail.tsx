"use client";

import type { ReactNode } from "react";
import { JADE_HSCROLL_DATA_ATTR } from "@/lib/horizontalScrollClasses";

/** Menu mobile — native momentum scroll (no JS drag override, no scroll-snap). */
export function MenuMobileImageRail({ children }: { children: ReactNode }) {
  return (
    <div className="menu-mobile-hscroll-shell relative w-full min-w-0">
      <div className="menu-hscroll-fade relative w-full min-w-0 overflow-hidden">
        <div
          {...{ [JADE_HSCROLL_DATA_ATTR]: "" }}
          className="jade-hscroll-track menu-mobile-hscroll-track flex w-full min-w-0 max-w-full flex-nowrap gap-2 overflow-x-auto scroll-pl-6 pl-6 pr-4 pb-1 scrollbar-none hide-scrollbar"
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
