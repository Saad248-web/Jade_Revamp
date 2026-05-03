/**
 * Single dark-green shell aligned with `theme.colors.jade.green` (villa detail sticky
 * sections). Use for full-screen experience overlays and matching form surfaces.
 */
export const EXPERIENCE_SHELL_BG_CLASS = "bg-jade-green";

/** @deprecated Use EXPERIENCE_SHELL_BG_CLASS */
export const EXPERIENCE_OVERLAY_BG_CLASS = EXPERIENCE_SHELL_BG_CLASS;

export const EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS = EXPERIENCE_SHELL_BG_CLASS;

export const EXPERIENCE_OVERLAY_ROOT_CLASS =
  `fixed inset-0 z-[9999] ${EXPERIENCE_SHELL_BG_CLASS} overflow-y-auto text-white scrollbar-none`;

export const EXPERIENCE_OVERLAY_STICKY_TABS_CLASS =
  `sticky top-0 z-[60] ${EXPERIENCE_SHELL_BG_CLASS} border-b border-white/10 mb-8 flex overflow-x-auto scrollbar-none py-2`;

export const EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS =
  `fixed bottom-0 left-0 w-full ${EXPERIENCE_SHELL_BG_CLASS} border-t border-white/10 py-4 z-[150] transition-all flex justify-center`;

export const EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS =
  "fixed top-6 right-6 z-[200] w-12 h-12 flex items-center justify-center bg-[#124131] rounded-full text-white shadow-2xl pointer-events-auto hover:bg-[#1f5c48] transition-colors";
