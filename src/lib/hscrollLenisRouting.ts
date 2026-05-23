/** Horizontal marketing rails — shared Lenis + gesture routing. */

export const HORIZONTAL_SCROLL_RAIL_SELECTOR =
  ".jade-hscroll-track, .amenity-highlight-track--responsive";

export function isHorizontalScrollRailElement(
  node: EventTarget | null,
): node is HTMLElement {
  if (!(node instanceof HTMLElement)) return false;
  return (
    node.classList.contains("jade-hscroll-track") ||
    node.classList.contains("amenity-highlight-track--responsive")
  );
}

export function findHorizontalScrollRailInPath(
  event: Event,
): HTMLElement | undefined {
  const path =
    typeof event.composedPath === "function" ? event.composedPath() : [];
  return path.find((n) => isHorizontalScrollRailElement(n)) as
    | HTMLElement
    | undefined;
}

/**
 * Lenis virtualScroll hook: vertical gestures on a horizontal rail scroll the page;
 * clearly horizontal gestures stay on the rail (native / nested).
 */
export function routeLenisVirtualScrollOverHorizontalRail(data: {
  deltaX: number;
  deltaY: number;
  event: WheelEvent | TouchEvent;
}): boolean {
  const rail = findHorizontalScrollRailInPath(data.event);
  if (!rail) return true;

  const absY = Math.abs(data.deltaY);
  const absX = Math.abs(data.deltaX);

  if (absY > absX * 0.55) {
    return true;
  }

  if (absX > 0 || absY > 0) {
    return false;
  }

  return true;
}
