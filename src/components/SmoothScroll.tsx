"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import "lenis/dist/lenis.css";
import {
  emitLenisScroll,
  type LenisInstance,
  type LenisScrollPayload,
} from "@/lib/lenis";

/** Single global Lenis — all App Router pages via root Providers. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      // One smooth layer only — avoid stacking springs on top of low lerp
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
      autoResize: true,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    (window as unknown as { __lenis: LenisInstance | null }).__lenis =
      lenis as unknown as LenisInstance;

    const onLenisScrollEvent = (instance: Lenis) => {
      emitLenisScroll({
        scroll: instance.scroll,
        velocity: instance.velocity,
        direction: instance.direction,
        progress: instance.progress,
      });
    };

    lenis.on("scroll", onLenisScrollEvent);

    // Single animation clock: Lenis + GSAP share one ticker (no competing RAF loops)
    gsap.ticker.lagSmoothing(0);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);

    const onResize = () => lenis.resize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onLenisScrollEvent);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      (window as unknown as { __lenis: LenisInstance | null }).__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
