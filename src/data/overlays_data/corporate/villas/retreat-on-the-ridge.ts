import { retreatOnTheRidge } from "@/data/retreats/retreat-on-the-ridge";
import type { CorporateVillaOverlayEntry } from "../types";

/** Corporate overlay — source: public/Corporate_Villa_Overlay/Retreat on the Ridge.svg */
export const retreatOnTheRidgeCorporateOverlay = {
  ...retreatOnTheRidge,
  type: "HILLTOP STRATEGY RETREAT",
  location: "Gudibande",
  description:
    "Perched on a hilltop with panoramic valley views, Retreat on the Ridge is designed for focused leadership sessions and strategic offsites. Its serene setting and intimate scale make it ideal for executive alignment, planning retreats, and high-impact workshops.",
  perfectForTags: [
    "Leadership Retreats",
    "Executive Workshops",
    "Strategy Planning Sessions",
    "Brainstorming Offsites",
    "Focused Team Alignment",
  ],
  stats: {
    ...retreatOnTheRidge.stats,
    stay: "20 Guests",
    events: "50 Guests",
    lawn: "Hilltop Private Setting",
    villaArea: "Elevated Private Setting",
  },
  categories: [
    "Leadership Retreats",
    "Executive Workshops",
    "Strategy Planning Sessions",
    "Brainstorming Offsites",
    "Focused Team Alignment",
  ],
  overlay: { onwardsPrice: "₹75,000" },
} as CorporateVillaOverlayEntry;
