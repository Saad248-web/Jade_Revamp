import { scheduleScrollUpdate } from "@/lib/batchScrollUpdate";

export type LenisScrollPayload = {
  scroll: number;
  progress: number;
  velocity: number;
  direction: number;
};

type LenisScrollListener = (payload: LenisScrollPayload) => void;

const listeners = new Set<LenisScrollListener>();

/** Subscribe to Lenis scroll (rAF-batched). Returns unsubscribe. */
export function subscribeLenisScroll(listener: LenisScrollListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(payload: LenisScrollPayload) {
  scheduleScrollUpdate(() => {
    listeners.forEach((fn) => fn(payload));
  });
}

type LenisEmitter = {
  on: (
    event: "scroll",
    callback: (lenis: {
      scroll: number;
      progress: number;
      velocity: number;
      direction: number;
    }) => void,
  ) => () => void;
};

/** Wire Lenis instance → batched scroll subscribers (chrome hide, analytics hooks). */
export function attachLenisScrollBridge(lenis: LenisEmitter): () => void {
  return lenis.on("scroll", (instance) => {
    emit({
      scroll: instance.scroll,
      progress: instance.progress,
      velocity: instance.velocity,
      direction: instance.direction,
    });
  });
}
