/** Shared dismiss (X) control for modal / sheet overlays. */

export const OVERLAY_DISMISS_BUTTON_BASE =
  "w-12 h-12 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl flex-shrink-0";

/** Fixed to viewport — horizontally centered at top (safe-area aware). */
export const OVERLAY_DISMISS_BUTTON_VIEWPORT_TOP_CLASS = `fixed left-0 right-0 mx-auto top-[max(0.75rem,env(safe-area-inset-top,0px))] z-[102] ${OVERLAY_DISMISS_BUTTON_BASE}`;
