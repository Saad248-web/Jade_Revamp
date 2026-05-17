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
  "sticky top-0 z-[60] bg-jade-charcoal border-b border-white/5 mb-0 w-full shadow-2xl";

export const EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS =
  "fixed bottom-0 left-0 w-full bg-jade-charcoal/90 backdrop-blur-md border-t border-white/10 pt-4 pb-6 md:pb-4 z-[150] transition-all flex justify-center";

export const EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS =
  "pointer-events-auto w-full h-full flex items-center justify-center rounded-full bg-jade-green text-white shadow-2xl hover:bg-jade-green/80 transition-colors";

export const EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS =
  "w-full mt-20 md:mt-0 pb-20 bg-jade-charcoal rounded-t-[32px] md:rounded-none";
