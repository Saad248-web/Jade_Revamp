/**
 * Shared layout for experience-category heroes (Corporate, Party Villa Retreats,
 * Weekend Getaways, Weddings via WeddingHero — all use ExperienceHero).
 * Mobile/tablet: stats + CTAs use the full padded hero width (Image 2 alignment).
 * Large screens: cap width for readability and center the chrome stack.
 */
export const EXPERIENCE_HERO_CHROME_WIDTH_CLASS =
  "w-full lg:max-w-2xl lg:mx-auto xl:max-w-[40rem]";

import { MOBILE_BOTTOM_NAV_CLEARANCE_CLASS } from "@/lib/layoutSpacing";

/**
 * Bottom padding: mobile/tablet = nav height + ~20–24px gap (no double safe-area).
 * Desktop: modest padding only (`MobileBottomNav` is hidden at `lg`).
 */
export const EXPERIENCE_HERO_SAFE_BOTTOM_CLASS =
  `${MOBILE_BOTTOM_NAV_CLEARANCE_CLASS} lg:pb-12`;
