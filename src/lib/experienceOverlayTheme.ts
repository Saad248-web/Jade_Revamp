/**
 * Single dark-green shell aligned with `theme.colors.jade.green` (villa detail sticky
 * sections). Use for full-screen experience overlays and matching form surfaces.
 */
export const EXPERIENCE_SHELL_BG_CLASS = "bg-jade-green";

/** @deprecated Use EXPERIENCE_SHELL_BG_CLASS */
export const EXPERIENCE_OVERLAY_BG_CLASS = EXPERIENCE_SHELL_BG_CLASS;

export const EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS = "bg-[#25282C]";

/** Root: no background — individual sections alternate their own colours */
export const EXPERIENCE_OVERLAY_ROOT_CLASS =
  "fixed inset-0 z-[9999] bg-black/60 md:bg-[#25282C] backdrop-blur-sm md:backdrop-blur-none overflow-hidden text-white";

/** Sticky tabs sit on charcoal matching the info block above */
export const EXPERIENCE_OVERLAY_STICKY_TABS_CLASS =
  "sticky top-0 z-[60] bg-[#25282C] border-b border-white/10 mb-0 flex overflow-x-auto scrollbar-none py-2";

export const EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS =
  "fixed bottom-0 left-0 w-full bg-[#25282C]/90 backdrop-blur-md border-t border-white/10 pt-4 pb-6 md:pb-4 z-[150] transition-all flex justify-center";

export const EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS =
  "fixed top-4 left-1/2 -translate-x-1/2 md:top-6 md:left-auto md:right-6 md:translate-x-0 z-[200] w-12 h-12 flex items-center justify-center bg-[#124131] rounded-full text-white shadow-2xl pointer-events-auto hover:bg-[#1f5c48] transition-colors";
