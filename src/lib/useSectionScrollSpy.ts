"use client";

import { useEffect, useRef } from "react";

export type SectionScrollSpyOptions = {
  /** DOM ids of sections in scroll order (top → bottom). */
  sectionIds: readonly string[];
  /** Called with the topmost visible section id. */
  onActiveSection: (sectionId: string) => void;
  /** Scroll container; omit for viewport (window) root. */
  root?: Element | null;
  rootMargin?: string;
  enabled?: boolean;
  /** Bump when scroll root ref is attached (overlay layout sync). */
  rootVersion?: number;
};

/**
 * Highlights the first section (in DOM order) that intersects the scroll root.
 * Used for sticky category tabs on villa detail + venue overlays.
 */
export function useSectionScrollSpy({
  sectionIds,
  onActiveSection,
  root = null,
  rootMargin = "-12% 0px -55% 0px",
  enabled = true,
  rootVersion = 0,
}: SectionScrollSpyOptions) {
  const onActiveRef = useRef(onActiveSection);
  onActiveRef.current = onActiveSection;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const visible = new Set<string>();

    const pickActive = () => {
      for (const id of sectionIds) {
        if (visible.has(id)) {
          onActiveRef.current(id);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        });
        pickActive();
      },
      { root: root ?? null, rootMargin, threshold: [0, 0.01, 0.1] },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, root, rootMargin, enabled, rootVersion]);
}
