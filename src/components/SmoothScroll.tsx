"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import type { LenisInstance } from "@/lib/lenis";
import {
  LENIS_EASING,
  LENIS_LERP,
  LENIS_SYNC_TOUCH_LERP,
  LENIS_TOUCH_MULTIPLIER,
  LENIS_WHEEL_MULTIPLIER,
  lenisSyncTouchEnabled,
} from "@/lib/lenisConfig";
import { attachLenisScrollBridge } from "@/lib/lenisScrollBridge";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("lenis", "lenis-smooth");

    const lenis = new Lenis({
      lerp: LENIS_LERP,
      smoothWheel: true,
      wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
      touchMultiplier: LENIS_TOUCH_MULTIPLIER,
      syncTouch: lenisSyncTouchEnabled(),
      syncTouchLerp: LENIS_SYNC_TOUCH_LERP,
      easing: LENIS_EASING,
      autoResize: true,
      anchors: {
        duration: 1.25,
        easing: LENIS_EASING,
        offset: -88,
      },
    });

    (window as unknown as { __lenis: LenisInstance | null }).__lenis =
      lenis as unknown as LenisInstance;

    const detachBridge = attachLenisScrollBridge(lenis);

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const onResize = () => lenis.resize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      detachBridge();
      lenis.destroy();
      (window as unknown as { __lenis: LenisInstance | null }).__lenis = null;
      root.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return <>{children}</>;
}
