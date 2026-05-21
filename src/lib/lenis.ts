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

export type LenisScrollPayload = {
  scroll: number;
  velocity: number;
  direction: 0 | 1 | -1;
  progress: number;
};

type LenisScrollListener = (payload: LenisScrollPayload) => void;

const scrollListeners = new Set<LenisScrollListener>();

/** Subscribe to Lenis scroll ticks (preferred over native `scroll` when Lenis is active). */
export function onLenisScroll(listener: LenisScrollListener): () => void {
  scrollListeners.add(listener);
  return () => scrollListeners.delete(listener);
}

/** Called from SmoothScroll on each Lenis scroll event. */
export function emitLenisScroll(payload: LenisScrollPayload) {
  scrollListeners.forEach((listener) => listener(payload));
}

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

export { useLenis } from "./useLenis";
