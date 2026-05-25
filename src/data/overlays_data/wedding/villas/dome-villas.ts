import { domeVillas } from "@/data/retreats/dome/estate";
import type { WeddingVillaOverlayEntry } from "../types";

/** Wedding overlay — source: public/Wedding_Villa_Overlay/Dome.svg */
export const domeVillasWeddingOverlay = {
  ...domeVillas,
  type: "FARMHOUSE WEDDING VENUE",
  location: "Bangalore",
  description:
    "Dome Villas is a private hillside retreat featuring three architecturally distinct dome villas set within landscaped gardens. Designed as a cluster, the property allows weddings to be distributed across multiple zones while maintaining privacy and flow. Each villa functions as an independent stay unit, while the overall layout supports gatherings, celebrations, and extended wedding formats. The setting combines dome-style architecture, garden pathways, and outdoor experience areas to create a venue suited for multi-day, intimate weddings.",
  perfectForTags: [
    "Weddings",
    "Reception",
    "Engagements",
    "Sangeet",
  ],
  stats: {
    ...domeVillas.stats,
    stay: "50 Guests",
    events: "150 Guests",
    lawn: "15,000 sq. ft. lawn",
  },
  categories: [
    "Weddings",
    "Reception",
    "Engagements",
    "Sangeet",
  ],
  overlay: {
    onwardsPrice: "₹75,000",
    parking: "80",
  },
} as WeddingVillaOverlayEntry;
