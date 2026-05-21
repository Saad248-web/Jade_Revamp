"use client";

import { useLayoutEffect, useRef } from "react";

/** Keeps the active tab button centered in a horizontal overflow tab track. */
export function useScrollTabIntoView(activeTabKey: string) {
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || !activeTabKey) return;

    const activeBtn = track.querySelector<HTMLElement>(
      `[data-tab-key="${CSS.escape(activeTabKey)}"]`,
    );
    if (!activeBtn) return;

    activeBtn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTabKey]);

  return trackRef;
}
