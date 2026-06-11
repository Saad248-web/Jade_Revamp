/**
 * Scroll cue — mouse outline + wheel dot (stretch → glide → compress).
 */

/** Loop duration — drives `--jade-scroll-line-duration` on the mouse shell */
export const SCROLL_LINE_DURATION_MS = 2800;

/** Standard wheel dot width/height at rest (px) — width never changes during animation */
export const SCROLL_LINE_DOT_SIZE_PX = 8;

/** Mouse body: wide pill, thick stroke, transparent fill */
export const SCROLL_LINE_MOUSE_CLASS =
  "jade-scroll-mouse relative w-[44px] h-[68px] border-[4px] border-white rounded-[22px] bg-transparent";

/** Inner scroll wheel dot — width locked via CSS var `--jade-scroll-dot-size` */
export const SCROLL_LINE_WHEEL_CLASS =
  "jade-scroll-wheel absolute left-1/2 top-[8px] rounded-full bg-white";

/** @deprecated Rail removed — kept for import compatibility */
export const SCROLL_LINE_WHEEL_SLOT_CLASS = "jade-scroll-wheel-slot";
/** @deprecated Rail removed — kept for import compatibility */
export const SCROLL_LINE_WHEEL_RAIL_CLASS = "jade-scroll-wheel-rail";

/** Host row pinned to hero / panel bottom — child uses `floating` for offset */
export const SCROLL_LINE_INDICATOR_HERO_WRAPPER_CLASS =
  "absolute inset-x-0 bottom-0 z-20 flex justify-center pointer-events-none";

/** Default flex gap between optional label and indicator */
export const SCROLL_LINE_INDICATOR_ROOT_GAP_CLASS = "gap-3";

/** Clickable floating cue on heroes */
export const SCROLL_LINE_INDICATOR_CLICKABLE_CLASS =
  "pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity";
