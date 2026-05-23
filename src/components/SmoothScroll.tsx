"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import type { LenisInstance } from "@/lib/lenis";
import {
  getLenisPresetConfig,
  getLenisPresetFromPathname,
  lenisSyncTouchEnabledForPreset,
  normalizeLenisPreset,
  type LenisScrollPreset,
  type SmoothScrollPreset,
} from "@/lib/lenisConfig";
import { attachLenisScrollBridge } from "@/lib/lenisScrollBridge";
import { markDisplayRefreshRate } from "@/lib/displayRefreshRate";

export type { LenisScrollPreset, SmoothScrollPreset };

export default function SmoothScroll({
  children,
  preset: presetProp,
}: {
  children: ReactNode;
  /** Omit to auto-resolve from pathname (`/book` → balanced, else extreme). */
  preset?: SmoothScrollPreset;
}) {
  const pathname = usePathname();
  const preset: LenisScrollPreset = useMemo(() => {
    if (presetProp != null) return normalizeLenisPreset(presetProp);
    return getLenisPresetFromPathname(pathname ?? "/");
  }, [pathname, presetProp]);

  const config = useMemo(() => getLenisPresetConfig(preset), [preset]);
  const syncTouch = lenisSyncTouchEnabledForPreset(preset);
  const useTouchInertia = preset === "extreme";

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("lenis", "lenis-smooth");
    root.dataset.jadeLenisPreset = preset;
    markDisplayRefreshRate(root);

    const lenis = new Lenis({
      lerp: config.lerp,
      smoothWheel: true,
      wheelMultiplier: config.wheelMultiplier,
      touchMultiplier: config.touchMultiplier,
      syncTouch,
      syncTouchLerp: config.syncTouchLerp,
      ...(useTouchInertia && config.touchInertiaExponent != null
        ? { touchInertiaExponent: config.touchInertiaExponent }
        : {}),
      allowNestedScroll: true,
      easing: config.easing,
      autoResize: true,
      autoRaf: true,
      anchors: {
        duration: config.anchorDuration,
        easing: config.easing,
        offset: -88,
      },
    });

    (window as unknown as { __lenis: LenisInstance | null }).__lenis =
      lenis as unknown as LenisInstance;

    const detachBridge = attachLenisScrollBridge(lenis);

    const onResize = () => lenis.resize();
    window.addEventListener("resize", onResize, { passive: true });

    const burstResize = () => lenis.resize();
    burstResize();
    const burstTimers = [120, 400, 900, 1800].map((ms) =>
      setTimeout(burstResize, ms),
    );
    window.addEventListener("load", burstResize, { once: true });

    return () => {
      burstTimers.forEach(clearTimeout);
      window.removeEventListener("load", burstResize);
      window.removeEventListener("resize", onResize);
      detachBridge();
      lenis.destroy();
      (window as unknown as { __lenis: LenisInstance | null }).__lenis = null;
      root.classList.remove("lenis", "lenis-smooth", "jade-hrr");
      delete root.dataset.jadeDisplayHz;
      delete root.dataset.jadeLenisPreset;
    };
  }, [config, preset, syncTouch, useTouchInertia]);

  return <>{children}</>;
}
