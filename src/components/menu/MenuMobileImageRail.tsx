"use client";

import type { ReactNode } from "react";
import HorizontalScrollRail from "@/components/ui/HorizontalScrollRail";

/** Menu mobile — full panel width; pl-6 track aligns with titles; fade at device right. */
export function MenuMobileImageRail({ children }: { children: ReactNode }) {
  return (
    <div className="menu-mobile-hscroll-shell relative w-full min-w-0 overflow-visible">
      <HorizontalScrollRail
        showFade
        patternFade
        cursorGrab
        nestedVerticalScroll
        className="menu-hscroll-fade w-full min-w-0"
        trackClassName="flex w-max max-w-none gap-2 overflow-x-scroll scroll-pl-6 pl-6 scroll-pr-0 pr-0 pb-1 scrollbar-none hide-scrollbar snap-x snap-proximity"
      >
        {children}
      </HorizontalScrollRail>
    </div>
  );
}
