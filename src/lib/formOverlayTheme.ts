/**
 * Form-filling overlays (Partner, Enquire, Careers apply) — mobile sheet uses
 * the same 8svh / 92svh proportions as Know More venue overlays; sheet fill is green.
 */

export const FORM_OVERLAY_ROOT_CLASS =
  "fixed inset-0 z-[9999] overflow-hidden text-white";

export const FORM_OVERLAY_MOBILE_SHEET_FRAME_CLASS =
  "relative z-10 flex h-full min-h-0 flex-col overflow-hidden rounded-t-[32px] bg-jade-green isolate";

/**
 * Scroll container bottom pad — keeps in-flow CTAs above the sheet lip + home indicator.
 * Applied in {@link FormOverlayLayout} so all form overlays inherit it.
 */
export const FORM_OVERLAY_MOBILE_SCROLL_PAD_CLASS =
  "max-md:pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.25rem))]";
