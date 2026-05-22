"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getLenis } from "@/lib/lenis";
import { subscribeLenisScrollImmediate } from "@/lib/lenisScrollBridge";

type HideListener = (hidden: boolean) => void;

let hidden = false;
const listeners = new Set<HideListener>();
let subscriberCount = 0;
let disposeEngine: (() => void) | undefined;

function emit(next: boolean) {
  if (next === hidden) return;
  hidden = next;
  listeners.forEach((fn) => fn(hidden));
}

/** Instant direction reflex — no px threshold, no rAF batch. */
function attachScrollHideEngine(): () => void {
  let lastY = getLenis()?.scroll ?? window.scrollY;

  const evaluate = (y: number, direction?: number) => {
    if (y <= 0) {
      lastY = y;
      emit(false);
      return;
    }

    const previous = lastY;
    lastY = y;

    if (direction != null && direction !== 0) {
      emit(direction > 0);
      return;
    }

    const delta = y - previous;
    if (delta > 0) emit(true);
    else if (delta < 0) emit(false);
  };

  const unsubLenis = subscribeLenisScrollImmediate(({ scroll, direction }) => {
    evaluate(scroll, direction);
  });

  const onWindowScroll = () => {
    if (getLenis()) return;
    evaluate(window.scrollY);
  };

  window.addEventListener("scroll", onWindowScroll, { passive: true });
  evaluate(lastY);

  return () => {
    unsubLenis();
    window.removeEventListener("scroll", onWindowScroll);
  };
}

function subscribeHide(listener: HideListener): () => void {
  listeners.add(listener);
  listener(hidden);
  return () => listeners.delete(listener);
}

function acquireEngine() {
  subscriberCount += 1;
  if (subscriberCount === 1) {
    disposeEngine = attachScrollHideEngine();
  }
}

function releaseEngine() {
  subscriberCount = Math.max(0, subscriberCount - 1);
  if (subscriberCount === 0) {
    disposeEngine?.();
    disposeEngine = undefined;
    hidden = false;
    listeners.forEach((fn) => fn(false));
  }
}

/** Navbar: hide on any scroll down, show on any scroll up (immediate). */
export function useBatchedScrollHide(): boolean {
  useEffect(() => {
    acquireEngine();
    return releaseEngine;
  }, []);

  return useSyncExternalStore(
    subscribeHide,
    () => hidden,
    () => false,
  );
}
