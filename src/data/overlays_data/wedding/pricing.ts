import { WEDDING_VILLAS_OVERLAY_DATA } from "./villas/index";

/** Derived from per-villa `overlay.onwardsPrice` (single source of truth). */
export const WEDDING_PRICING_ONWARDS: Record<string, string> = {
  default: "₹75,000",
  ...Object.fromEntries(
    Object.entries(WEDDING_VILLAS_OVERLAY_DATA).map(([id, entry]) => [
      id,
      entry.overlay.onwardsPrice,
    ]),
  ),
};
