import { useEffect, type RefObject } from "react";

const AXIS_THRESHOLD_PX = 8;

/**
 * Axis-locked touch scrolling for horizontal rails inside vertical panels.
 * Horizontal swipe → scrolls the rail; vertical swipe → passes to parent.
 */
export function useNestedHorizontalTouchScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled = true,
) {
  useEffect(() => {
    const track = ref.current;
    if (!track || !enabled) return;

    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let axis: "x" | "y" | null = null;

    const reset = () => {
      axis = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollLeft = track.scrollLeft;
      axis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (!axis) {
        if (
          Math.abs(dx) < AXIS_THRESHOLD_PX &&
          Math.abs(dy) < AXIS_THRESHOLD_PX
        ) {
          return;
        }
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (axis === "y") return;

      e.preventDefault();
      track.scrollLeft = startScrollLeft - dx;
    };

    const onTouchEnd = () => reset();

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    track.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled, ref]);
}
