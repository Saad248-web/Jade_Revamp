"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import type { LenisInstance } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      // Higher lerp = less drift after wheel stops (was 0.075 — felt like snap-back)
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      autoResize: true,
    });

    (window as unknown as { __lenis: LenisInstance | null }).__lenis =
      lenis as unknown as LenisInstance;

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
      lenis.destroy();
      (window as unknown as { __lenis: LenisInstance | null }).__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
