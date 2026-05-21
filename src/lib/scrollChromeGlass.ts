/**
 * Shared glass chrome for sticky category tabs + pricing bottom bars.
 * Villa detail uses transparent fill; venue overlays use white @ 5% on green shell.
 */

const GLASS_BLUR = "backdrop-blur-2xl";
const GLASS_SHADOW_TOP = "shadow-[0_8px_32px_rgba(0,0,0,0.12)]";
const GLASS_SHADOW_BOTTOM = "shadow-[0_-8px_32px_rgba(0,0,0,0.12)]";

/** Villa detail — matches fixed pricing bottom bar (transparent + blur). */
export const VILLA_DETAIL_SCROLL_CHROME_GLASS =
  `${GLASS_BLUR} border-white/10`;

export const VILLA_DETAIL_STICKY_TABS_CHROME_CLASS = `border-b ${VILLA_DETAIL_SCROLL_CHROME_GLASS} bg-transparent ${GLASS_SHADOW_TOP}`;

export const VILLA_DETAIL_PRICING_BOTTOM_BAR_CHROME_CLASS = `border-t ${VILLA_DETAIL_SCROLL_CHROME_GLASS} bg-transparent ${GLASS_SHADOW_BOTTOM}`;

/** Wedding / corporate / party overlays — white fill @ 5% on green sections. */
export const OVERLAY_SCROLL_CHROME_GLASS =
  `${GLASS_BLUR} border-white/10 bg-white/[0.05]`;

export const OVERLAY_STICKY_TABS_CHROME_CLASS = `border-b ${OVERLAY_SCROLL_CHROME_GLASS} ${GLASS_SHADOW_TOP}`;

export const OVERLAY_PRICING_BOTTOM_BAR_CHROME_CLASS = `border-t ${OVERLAY_SCROLL_CHROME_GLASS} ${GLASS_SHADOW_BOTTOM}`;
