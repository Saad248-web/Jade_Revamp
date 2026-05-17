/** Global Lenis instance (set in SmoothScroll). */

export type LenisInstance = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { immediate?: boolean; duration?: number; lock?: boolean },
  ) => void;
  resize: () => void;
  stop: () => void;
  start: () => void;
  destroy: () => void;
  raf: (time: number) => void;
};

export function getLenis(): LenisInstance | null {
  if (typeof window === "undefined") return null;
  return (
    (window as unknown as { __lenis?: LenisInstance | null }).__lenis ?? null
  );
}

export function scrollToY(
  top: number,
  options?: { immediate?: boolean; duration?: number },
) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(top, options);
    return;
  }
  window.scrollTo({ top, behavior: options?.immediate ? "auto" : "smooth" });
}
