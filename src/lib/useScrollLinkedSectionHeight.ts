"use client";

import { useMediaMinLg } from "@/lib/useMediaMinLg";
import { SCROLL_LINKED_SECTION_VH } from "@/lib/scrollLinkedFreeScroll";

type SectionKey = keyof typeof SCROLL_LINKED_SECTION_VH;

/** Responsive pinned height for scroll-linked horizontal sections. */
export function useScrollLinkedSectionHeight(section: SectionKey): number {
  const isLg = useMediaMinLg();
  const map = SCROLL_LINKED_SECTION_VH[section];
  return isLg ? map.desktop : map.mobile;
}
