"use client";

import { useEffect } from "react";
import { JADE_LENIS_PREVENT_TOUCH } from "@/lib/horizontalScrollClasses";

/** Horizontal marketing rails — touch-only Lenis opt-out (wheel still scrolls page). */
const HSCROLL_TOUCH_ONLY_SELECTOR =
  ".jade-hscroll-track, .amenity-highlight-track--responsive, [data-jade-hscroll], [data-jade-tab-rail] .jade-hscroll-track";

/** Own scroll roots (SDA demo) — full Lenis prevent. */
const FULL_LENIS_PREVENT_SELECTOR =
  "#experience-sda-scroller, [data-page-scroll-root]";

function applyHorizontalRailTouchPrevent(el: HTMLElement) {
  el.removeAttribute("data-lenis-prevent");
  if (!el.hasAttribute(JADE_LENIS_PREVENT_TOUCH)) {
    el.setAttribute(JADE_LENIS_PREVENT_TOUCH, "");
  }
}

function applyFullLenisPrevent(el: HTMLElement) {
  if (!el.hasAttribute("data-lenis-prevent")) {
    el.setAttribute("data-lenis-prevent", "");
  }
}

/**
 * Horizontal rails: data-lenis-prevent-touch (vertical wheel keeps working over blog/tabs).
 * SDA scroller: data-lenis-prevent (dedicated scroll timeline).
 */
export default function HScrollTouchAssurance() {
  useEffect(() => {
    const apply = () => {
      document
        .querySelectorAll<HTMLElement>(HSCROLL_TOUCH_ONLY_SELECTOR)
        .forEach(applyHorizontalRailTouchPrevent);

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
      attributeFilter: ["data-lenis-prevent", JADE_LENIS_PREVENT_TOUCH],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
