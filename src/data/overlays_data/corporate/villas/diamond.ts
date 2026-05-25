import { diamond } from "@/data/retreats/diamond";
import type { CorporateVillaOverlayEntry } from "../types";

/** Corporate overlay — source: public/Corporate_Villa_Overlay/Diamond.svg */
export const diamondCorporateOverlay = {
  ...diamond,
  name: "Diamond Pavilion",
  type: "GRAND CORPORATE EVENT RETREAT",
  location: "Kanakapura Road",
  description:
    "Diamond Pavilion by Jade is a large-format corporate venue designed for conferences, recognition programmes, and milestone celebrations. With expansive lawns, multi-purpose halls, and structured breakout spaces, it supports high-capacity events without compromising privacy or operational flow.",
  perfectForTags: [
    "Corporate Offsites",
    "Cocktail Evenings",
    "Recognition & Award Nights",
    "Large Team Offsites",
    "Annual Gatherings",
  ],
  stats: {
    ...diamond.stats,
    stay: "50 Guests",
    events: "500 Guests",
    lawn: "3 Acres",
    villaArea: "3-Acre Private Estate",
  },
  categories: [
    "Corporate Offsites",
    "Cocktail Evenings",
    "Recognition & Award Nights",
    "Large Team Offsites",
    "Annual Gatherings",
  ],
  overlay: { onwardsPrice: "₹75,000" },
} as CorporateVillaOverlayEntry;
