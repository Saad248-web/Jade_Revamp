import { diamond } from "@/data/retreats/diamond";
import type { WeddingVillaOverlayEntry } from "../types";

/** Wedding overlay — source: public/Wedding_Villa_Overlay/Daimond.svg */
export const diamondWeddingOverlay = {
  ...diamond,
  type: "EXPANSIVE POOLSIDE WEDDING VENUE",
  location: "Kanakapura Road",
  description:
    "Diamond is a three-acre private event venue designed for large-format weddings and social gatherings. Surrounded by coconut trees and anchored by a 50,000 sq ft lawn and poolside setup, the space supports high-capacity celebrations with clear zoning for ceremonies, dining, and entertainment.",
  perfectForTags: [
    "Wedding",
    "Reception",
    "Mehendi",
    "Sangeet",
    "Large Celebrations",
  ],
  stats: {
    ...diamond.stats,
    stay: "50 Guests",
    events: "1500 Guests",
  },
  categories: [
    "Wedding",
    "Reception",
    "Mehendi",
    "Sangeet",
    "Large Celebrations",
  ],
  overlay: {
    onwardsPrice: "₹99,000",
    parking: "150+",
  },
} as WeddingVillaOverlayEntry;
