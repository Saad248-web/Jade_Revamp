/** Manual horizontal navigation tuning for scroll-linked sticky sections. */

/**
 * Grab / swipe: vertical scroll px applied per 1px of horizontal pointer movement.
 * Balanced for natural free-scroll feel (1px finger ≈ 1px content drift).
 */
export const SCROLL_LINKED_DRAG_FACTOR = 1.0;

/**
 * Wheel / two-finger trackpad: vertical scroll px per 1px horizontal wheel delta.
 * Positive deltaX (swipe content left → next) maps to forward scroll.
 */
export const SCROLL_LINKED_WHEEL_FACTOR = 1.1;
