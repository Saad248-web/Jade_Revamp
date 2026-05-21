"use client";

import { useCallback } from "react";
import { scrollToOverlaySection } from "@/lib/scrollToOverlaySection";
import {
  VENUE_OVERLAY_TABS,
  venueTabFromSectionId,
} from "@/lib/venueOverlaySectionNav";
import { useVenueOverlayScrollSpy } from "@/lib/useVenueOverlayScrollSpy";

/** Scroll-spy + scroll-to-section for wedding / corporate / party overlays. */
export function useVenueOverlaySectionNav(
  scrollRoot: HTMLDivElement | null,
  setActiveTab: (tab: string) => void,
  enabled: boolean,
  scrollRootVersion = 0,
) {
  useVenueOverlayScrollSpy(scrollRoot, setActiveTab, enabled, scrollRootVersion);

  const scrollToSection = useCallback(
    (tabOrSectionId: string) => {
      const tab = venueTabFromSectionId(tabOrSectionId);
      if (tab) {
        setActiveTab(tab);
      } else if (
        (VENUE_OVERLAY_TABS as readonly string[]).includes(tabOrSectionId)
      ) {
        setActiveTab(tabOrSectionId);
      }
      scrollToOverlaySection(tabOrSectionId, scrollRoot);
    },
    [scrollRoot, setActiveTab],
  );

  return { scrollToSection };
}
