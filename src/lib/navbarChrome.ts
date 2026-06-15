/**
 * Global navbar action chrome — shared dimensions for glass icons + gold BOOK.
 * Keep phone, wishlist, and BOOK aligned at 44×44px (icon squares) on every page.
 */

/** Square glass icon — call, contact, wishlist */
export const NAVBAR_GLASS_ICON_CLASS =
  "flex h-11 w-11 min-h-[44px] min-w-[44px] max-h-[44px] max-w-[44px] shrink-0 items-center justify-center rounded-none border border-white/20 bg-white/[0.05] text-white backdrop-blur-sm transition-all duration-300 hover:bg-jade-gold hover:text-black";

/** Wishlist — same footprint as other icon buttons */
export const NAVBAR_WISHLIST_ICON_CLASS = `${NAVBAR_GLASS_ICON_CLASS} relative`;

/**
 * PrimaryButton overrides for navbar — locks height to match icon row;
 * overrides PrimaryButton fluid py clamp.
 */
export const NAVBAR_BOOK_BUTTON_CLASS =
  "h-11 min-h-[44px] max-h-[44px] shrink-0 px-4 md:px-5 !py-0 leading-none";

/** Right-side action cluster — consistent gap between icons + BOOK */
export const NAVBAR_ACTIONS_CLUSTER_CLASS = "flex items-center gap-2";
