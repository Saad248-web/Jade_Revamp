"use client";

import { useEffect, useRef, type RefObject } from "react";
import Lenis from "lenis";
import {
  LENIS_EASING,
  PANEL_LENIS_LERP,
  PANEL_LENIS_WHEEL_MULTIPLIER,
} from "@/lib/lenisConfig";

type PanelLenis = InstanceType<typeof Lenis>;

const instances = new WeakMap<HTMLElement, PanelLenis>();

/** Silk wheel scroll inside a single data-lenis-prevent vertical panel. */
export function useNestedLenisPanel(
  scrollRootRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const wrapper = scrollRootRef.current;
    if (!wrapper || !wrapper.hasAttribute("data-lenis-prevent")) return;

    const content =
      (wrapper.firstElementChild as HTMLElement | null) ?? wrapper;

    let lenis = instances.get(wrapper);
    if (!lenis) {
      lenis = new Lenis({
        wrapper,
        content,
        lerp: PANEL_LENIS_LERP,
        smoothWheel: true,
        wheelMultiplier: PANEL_LENIS_WHEEL_MULTIPLIER,
        easing: LENIS_EASING,
        autoResize: true,
      });
      instances.set(wrapper, lenis);
    }

    const raf = (time: number) => {
      lenis!.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis!.destroy();
      instances.delete(wrapper);
    };
  }, [scrollRootRef, enabled]);
}
