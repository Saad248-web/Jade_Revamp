import { haven } from "@/data/retreats/haven";
import type { WeddingVillaOverlayEntry } from "../types";

/** Wedding overlay — source: public/Wedding_Villa_Overlay/The Haven.svg */
export const havenWeddingOverlay = {
  ...haven,
  name: "The Haven",
  type: "FARMHOUSE WEDDING VENUE",
  location: "Bangalore",
  description:
    "Haven is a private farmhouse retreat designed for intimate weddings and experience-led celebrations. The property features a 15,000 sq ft lawn along with a villa setup, allowing events to scale while maintaining a personal and relaxed atmosphere. With a private pool, jacuzzi, and curated group experiences, the venue supports celebrations that extend beyond a single event into a full-stay format.",
  perfectForTags: [
    "Intimate Weddings",
    "Reception",
    "Mehendi",
    "Sangeet",
  ],
  stats: {
    ...haven.stats,
    stay: "50 Guests",
    events: "150 Guests",
    bhk: "5 BHK",
    lawn: "15,000 sq. ft. lawn",
  },
  categories: [
    "Intimate Weddings",
    "Reception",
    "Mehendi",
    "Sangeet",
  ],
  overlay: {
    onwardsPrice: "₹75,000",
    parking: "—",
  },
} as WeddingVillaOverlayEntry;
