/**
 * Experience overlay palette — aligned with villa detail (`bg-jade-charcoal` / `bg-jade-green`).
 * Overlay-only tokens; do not import villa detail page structure.
 *
 * Section background transitions use `@/components/ui/MeanderStrip` (Sep_bar_design.svg).
 */

export const OVERLAY_SECTION_CHARCOAL = "w-full bg-jade-charcoal text-white";
export const OVERLAY_SECTION_GREEN = "w-full bg-jade-green text-white";

export const EXPERIENCE_SHELL_BG_CLASS = "bg-jade-green";

/** @deprecated Use EXPERIENCE_SHELL_BG_CLASS */
export const EXPERIENCE_OVERLAY_BG_CLASS = EXPERIENCE_SHELL_BG_CLASS;

export const EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS = "bg-jade-charcoal";

/** Scrim behind sheet only — rounded-corner edges (70% black). */
export const EXPERIENCE_OVERLAY_MOBILE_SCRIM_CLASS =
  "bg-black/70 backdrop-blur-sm";

/** Phone: top 8vh clear; scrim only under sheet. Desktop: full bleed. */
export const EXPERIENCE_OVERLAY_ROOT_CLASS =
  "fixed inset-0 z-[9999] max-md:bg-transparent max-md:backdrop-blur-none md:bg-jade-charcoal backdrop-blur-sm md:backdrop-blur-none overflow-hidden text-white";

/** Mobile bottom-sheet proportions (tap band + sheet = 100vh). */
export const EXPERIENCE_OVERLAY_MOBILE_TOP_SHADE_VH = 8;
export const EXPERIENCE_OVERLAY_MOBILE_SHEET_VH = 92;

/** Top 8vh tap-to-dismiss band — transparent; scrim shows through from root. */
export const EXPERIENCE_OVERLAY_MOBILE_TOP_SHADE_CLASS =
  "h-[8vh] min-h-[8vh] shrink-0 bg-transparent";

/** 92vh zone — scrim layer sits here (not in top 8vh). */
export const EXPERIENCE_OVERLAY_MOBILE_SHEET_ZONE_CLASS =
  "h-[92vh] min-h-0 shrink-0 relative";

/** Scrim fill for sheet zone (corner wedges). */
export const EXPERIENCE_OVERLAY_MOBILE_SHEET_SCRIM_CLASS = `absolute inset-0 pointer-events-none ${EXPERIENCE_OVERLAY_MOBILE_SCRIM_CLASS}`;

/** Stuck sheet — rounded top clips scrolling content. */
export const EXPERIENCE_OVERLAY_MOBILE_SHEET_FRAME_CLASS =
  "relative z-10 flex h-full min-h-0 flex-col overflow-hidden rounded-t-[32px] bg-jade-charcoal isolate";

export const EXPERIENCE_OVERLAY_STICKY_TABS_CLASS =
  "sticky top-0 z-[60] mb-0 w-full border-b border-white/10 bg-transparent backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]";

const EXPERIENCE_OVERLAY_BOTTOM_BAR_BASE =
  "w-full bg-jade-charcoal/90 backdrop-blur-2xl border-t border-white/10 pt-4 pb-6 md:pb-4 transition-all flex justify-center shadow-[0_-8px_32px_rgba(0,0,0,0.12)]";

/** Pinned inside 80vh mobile sheet. */
export const EXPERIENCE_OVERLAY_BOTTOM_BAR_SHEET_CLASS =
  `${EXPERIENCE_OVERLAY_BOTTOM_BAR_BASE} relative shrink-0 z-[20]`;

/** Fixed to viewport (desktop). */
export const EXPERIENCE_OVERLAY_BOTTOM_BAR_CLASS = `${EXPERIENCE_OVERLAY_BOTTOM_BAR_BASE} fixed bottom-0 left-0 z-[150] hidden md:flex`;

export const EXPERIENCE_OVERLAY_CLOSE_BUTTON_CLASS =
  "pointer-events-auto w-full h-full flex items-center justify-center rounded-full border border-white/15 bg-transparent text-white backdrop-blur-2xl shadow-lg transition-colors hover:border-white/35";

/** Body continues inside clipped sheet; padding for in-sheet footer on mobile. */
export const EXPERIENCE_OVERLAY_CONTENT_FRAME_CLASS =
  "w-full pb-6 max-md:pb-8 md:pb-20 bg-jade-charcoal max-md:rounded-none md:rounded-none";

/** Full-viewport mobile host — no fill; top band stays clear (hidden at md+). */
export const EXPERIENCE_OVERLAY_MOBILE_HOST_CLASS =
  "md:hidden fixed inset-0 flex flex-col overflow-hidden z-[1] bg-transparent";

/** Inner scroll — content clips under sheet top radius. */
export const EXPERIENCE_OVERLAY_MOBILE_SCROLL_SHEET_CLASS =
  "min-h-0 flex-1 overflow-y-auto overscroll-y-contain scrollbar-none touch-pan-y [overscroll-behavior:contain]";

/** Desktop full-bleed scroll (unchanged). */
export const EXPERIENCE_OVERLAY_DESKTOP_BODY_CLASS =
  "hidden md:block absolute inset-0 overflow-y-auto overscroll-y-contain scrollbar-none touch-pan-y [overscroll-behavior:contain]";
