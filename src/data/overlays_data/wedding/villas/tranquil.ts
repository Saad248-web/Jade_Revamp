import { tranquil } from "@/data/retreats/tranquil";
import type { WeddingVillaOverlayEntry } from "../types";

/** Wedding overlay — source: public/Wedding_Villa_Overlay/Tranquil.svg */
export const tranquilWeddingOverlay = {
  ...tranquil,
  type: "HOBBIT THEMED FARMHOUSE",
  location: "Kanakapura",
  description:
    "Tranquil Woods by Jade is an expansive wedding estate that blends nature with elegance. A vast, lush lawn forms the heart of the venue, creating a strong visual and functional foundation for grand ceremonies and receptions. Wide-open spaces, a private pool, and thoughtfully placed semi-open areas allow celebrations to flow comfortably across the property while maintaining a sense of openness and scale.",
  perfectForTags: [
    "Wedding",
    "Reception",
    "Mehendi",
    "Sangeet",
    "Pre-wedding",
  ],
  stats: {
    ...tranquil.stats,
    stay: "20 Guests",
    events: "600 Guests",
    lawn: "2-acre estate · 50,000 sq ft Lawn",
  },
  categories: [
    "Wedding",
    "Reception",
    "Mehendi",
    "Sangeet",
    "Pre-wedding",
  ],
  overlay: {
    onwardsPrice: "₹65,000",
    parking: "80",
  },
} as WeddingVillaOverlayEntry;
