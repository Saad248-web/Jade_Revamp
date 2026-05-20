/**
 * Experience overlay palette — aligned with villa detail (`bg-jade-charcoal` / `bg-jade-green`).
 * Overlay-only tokens; do not import villa detail page structure.
 */

export const OVERLAY_SECTION_CHARCOAL = "w-full bg-jade-charcoal text-white";
export const OVERLAY_SECTION_GREEN = "w-full bg-jade-green text-white";

export const EXPERIENCE_SHELL_BG_CLASS = "bg-jade-green";

/** @deprecated Use EXPERIENCE_SHELL_BG_CLASS */
export const EXPERIENCE_OVERLAY_BG_CLASS = EXPERIENCE_SHELL_BG_CLASS;

export const EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS = "bg-jade-charcoal";

export const EXPERIENCE_OVERLAY_ROOT_CLASS =
  "fixed inset-0 z-[9999] bg-black/60 md:bg-jade-charcoal backdrop-blur-sm md:backdrop-blur-none overflow-hidden text-white";

export const EXPERIENCE_OVERLAY_STICKY_TABS_CLASS =
  "sticky top-0 z-[60] mb-0 w-full border-b border-white/10 bg-transparent backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]";

/** Floating chrome — no opaque fill; blur-only glass (see villa detail bars). */
export const EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS =
  "fixed bottom-0 left-0 w-full bg-transparent backdrop-blur-2xl border-t border-white/10 pt-4 pb-6 md:pb-4 z-[150] transition-all flex justify-center shadow-[0_-8px_32px_rgba(0,0,0,0.12)]";

export const EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS =
  "pointer-events-auto w-full h-full flex items-center justify-center rounded-full border border-white/15 bg-transparent text-white backdrop-blur-2xl shadow-lg transition-colors hover:border-white/35";

/** Hero carries top radius on mobile; body continues as one sheet below. */
export const EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS =
  "w-full pb-20 bg-jade-charcoal max-md:rounded-none md:rounded-none";

/** Stuck shell under root scrim — does not scroll on phone. */
export const EXPERIENCE_OVERLAY_MOBILE_FRAME_CLASS =
  "absolute inset-0 max-md:flex max-md:min-h-0 max-md:flex-col max-md:overflow-hidden";

/** Inner scroll sheet — hero, close, and body scroll together on phone. */
export const EXPERIENCE_OVERLAY_MOBILE_SCROLL_SHEET_CLASS =
  "max-md:min-h-0 max-md:flex-1 max-md:overflow-y-auto max-md:overscroll-y-contain max-md:scrollbar-none max-md:touch-pan-y";
