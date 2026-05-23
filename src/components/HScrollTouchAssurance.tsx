"use client";

import { useEffect } from "react";
import { HORIZONTAL_SCROLL_RAIL_SELECTOR } from "@/lib/hscrollLenisRouting";

/** Own scroll roots (SDA demo) — full Lenis prevent. */
const FULL_LENIS_PREVENT_SELECTOR =
  "#experience-sda-scroller, [data-page-scroll-root]";

function clearLenisBlocksOnHorizontalRail(el: HTMLElement) {
  el.removeAttribute("data-lenis-prevent");
  el.removeAttribute("data-lenis-prevent-touch");
  el.removeAttribute("data-lenis-prevent-wheel");
}

function applyFullLenisPrevent(el: HTMLElement) {
  if (!el.hasAttribute("data-lenis-prevent")) {
    el.setAttribute("data-lenis-prevent", "");
  }
}

/**
 * Marketing horizontal rails must NOT use data-lenis-prevent* — that locks vertical
 * scroll when the finger/cursor is on the row. Lenis allowNestedScroll + virtualScroll
 * routing handles axis choice. SDA scroller keeps full prevent.
 */
export default function HScrollTouchAssurance() {
  useEffect(() => {
    const apply = () => {
      document
        .querySelectorAll<HTMLElement>(HORIZONTAL_SCROLL_RAIL_SELECTOR)
        .forEach(clearLenisBlocksOnHorizontalRail);

      document
        .querySelectorAll<HTMLElement>(FULL_LENIS_PREVENT_SELECTOR)
        .forEach(applyFullLenisPrevent);
    };

    apply();

    const observer = new MutationObserver(() => {
      apply();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "data-lenis-prevent",
        "data-lenis-prevent-touch",
        "data-lenis-prevent-wheel",
        "class",
      ],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
