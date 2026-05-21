"use client";

import { useSectionScrollSpy } from "@/lib/useSectionScrollSpy";
import {
  VENUE_OVERLAY_SECTION_IDS,
  venueTabFromSectionId,
} from "@/lib/venueOverlaySectionNav";

/** Scroll-spy for wedding / corporate / party venue overlays (inner scroll root). */
export function useVenueOverlayScrollSpy(
  scrollRoot: HTMLDivElement | null,
  setActiveTab: (tab: string) => void,
  enabled: boolean,
  rootVersion = 0,
) {
  useSectionScrollSpy({
    sectionIds: VENUE_OVERLAY_SECTION_IDS,
    root: scrollRoot,
    rootMargin: "-10% 0px -50% 0px",
    enabled: enabled && scrollRoot != null,
    rootVersion,
    onActiveSection: (sectionId) => {
      const tab = venueTabFromSectionId(sectionId);
      if (tab) setActiveTab(tab);
    },
  });
}
