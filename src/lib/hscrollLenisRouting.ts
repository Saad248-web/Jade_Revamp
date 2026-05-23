/** Horizontal marketing rails — shared Lenis + gesture routing. */

export const HORIZONTAL_SCROLL_RAIL_CLASS = "jade-hscroll-track";
export const AMENITY_HORIZONTAL_RAIL_CLASS = "amenity-highlight-track--responsive";

export const HORIZONTAL_SCROLL_RAIL_SELECTOR = `.${HORIZONTAL_SCROLL_RAIL_CLASS}, .${AMENITY_HORIZONTAL_RAIL_CLASS}`;

export function closestHorizontalScrollRail(
  node: EventTarget | null,
): HTMLElement | null {
  if (!(node instanceof HTMLElement)) return null;
  return node.closest<HTMLElement>(HORIZONTAL_SCROLL_RAIL_SELECTOR);
}

export function findHorizontalScrollRailInPath(
  event: Event,
): HTMLElement | undefined {
  const path =
    typeof event.composedPath === "function" ? event.composedPath() : [];
  for (const node of path) {
    const rail = closestHorizontalScrollRail(node);
    if (rail) return rail;
  }
  return undefined;
}

/**
 * When the finger/cursor is on a horizontal rail, Lenis must not capture the gesture.
 * Returning false leaves native scrolling: vertical → page, horizontal → the rail.
 * (If Lenis runs syncTouch + preventDefault here, iOS/Android feel "stuck".)
 */
export function routeLenisVirtualScrollOverHorizontalRail(data: {
  deltaX: number;
  deltaY: number;
  event: WheelEvent | TouchEvent;
}): boolean {
  if (findHorizontalScrollRailInPath(data.event)) {
    return false;
  }
  return true;
}

/** Lenis `prevent` — same rule as virtualScroll for nodes in the rail subtree. */
export function preventLenisOnHorizontalRail(node: HTMLElement): boolean {
  return closestHorizontalScrollRail(node) != null;
}
