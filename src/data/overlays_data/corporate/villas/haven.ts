import { haven } from "@/data/retreats/haven";
import type { CorporateVillaOverlayEntry } from "../types";

/** Corporate overlay — source: public/Corporate_Villa_Overlay/Haven.svg */
export const havenCorporateOverlay = {
  ...haven,
  name: "The Haven",
  type: "POOLSIDE CORPORATE FARMHOUSE",
  location: "Hennur-Bagalur Road",
  description:
    "The Haven by Jade is a private farmhouse retreat designed for mid-sized corporate offsites and team gatherings. With a spacious lawn, poolside setting, and indoor breakout areas, it balances structured sessions with relaxed team engagement.",
  perfectForTags: [
    "Team Offsites",
    "Brainstorming Retreats",
    "Casual Team Meets",
    "Recognition Evenings",
    "Poolside Team Gatherings",
  ],
  stats: {
    ...haven.stats,
    stay: "25 Guests",
    events: "75 Guests",
    lawn: "25,000 sq ft Lawn",
    villaArea: "1.5-Acre Venue",
  },
  categories: [
    "Team Offsites",
    "Brainstorming Retreats",
    "Casual Team Meets",
    "Recognition Evenings",
    "Poolside Team Gatherings",
  ],
  overlay: { onwardsPrice: "₹75,000" },
} as CorporateVillaOverlayEntry;
