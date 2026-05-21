"use client";

import { useEffect, useRef, useState } from "react";
import { onLenisScroll } from "@/lib/lenis";
import { scheduleScrollUpdate } from "@/lib/batchScrollUpdate";

/** Hide chrome when scrolling down past `threshold`, show when scrolling up. */
export function useScrollHide(threshold = 150) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const thresholdRef = useRef(threshold);
  thresholdRef.current = threshold;

  useEffect(() => {
    const update = (scroll: number) => {
      scheduleScrollUpdate(() => {
        const previous = lastY.current;
        const nextHidden =
          scroll > previous && scroll > thresholdRef.current;
        setHidden((prev) => (prev === nextHidden ? prev : nextHidden));
        lastY.current = scroll;
      });
    };

    update(window.scrollY);

    const unsubLenis = onLenisScroll(({ scroll }) => update(scroll));

    const onNativeScroll = () => update(window.scrollY);
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      unsubLenis();
      window.removeEventListener("scroll", onNativeScroll);
    };
  }, [threshold]);

  return hidden;
}
