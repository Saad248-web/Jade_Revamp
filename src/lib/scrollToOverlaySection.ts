import { VENUE_OVERLAY_TAB_OFFSET_PX, venueSectionIdFromTab } from "@/lib/venueOverlaySectionNav";

/** Scroll an overlay's inner panel to a section by tab label (e.g. "Amenities"). */
export function scrollToOverlaySection(
  tabOrSectionId: string,
  scrollRoot: HTMLDivElement | null,
): boolean {
  const sectionId = venueSectionIdFromTab(tabOrSectionId);
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const container =
    scrollRoot ?? element.closest<HTMLElement>("[data-lenis-prevent].overflow-y-auto");

  if (container) {
    const top =
      element.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      VENUE_OVERLAY_TAB_OFFSET_PX;
    container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    return true;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
