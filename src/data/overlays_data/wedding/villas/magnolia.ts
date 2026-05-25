import { magnolia } from "@/data/retreats/magnolia";
import type { WeddingVillaOverlayEntry } from "../types";

/** Wedding overlay — source: public/Wedding_Villa_Overlay/Magnolia.svg */
export const magnoliaWeddingOverlay = {
  ...magnolia,
  type: "CONTEMPORARY GLASS VILLA",
  location: "Harohalli · Near Art of Living",
  description:
    "Magnolia is a contemporary private villa designed for large-format weddings and celebrations. With a spacious landscaped lawn, poolside zones, and indoor areas, the venue supports seamless movement across ceremonies, dining, and entertainment.",
  perfectForTags: [
    "Wedding",
    "Reception",
    "Mehendi",
    "Sangeet",
    "Pre-wedding",
  ],
  stats: {
    ...magnolia.stats,
    stay: "20 Guests",
    events: "1200 Guests",
  },
  categories: [
    "Wedding",
    "Reception",
    "Mehendi",
    "Sangeet",
    "Pre-wedding",
  ],
  overlay: {
    onwardsPrice: "₹99,000",
    parking: "80",
  },
} as WeddingVillaOverlayEntry;
