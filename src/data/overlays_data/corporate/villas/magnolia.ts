import { magnolia } from "@/data/retreats/magnolia";
import type { CorporateVillaOverlayEntry } from "../types";

/** Corporate overlay — source: public/Corporate_Villa_Overlay/Magnolia.svg */
export const magnoliaCorporateOverlay = {
  ...magnolia,
  type: "CONTEMPORARY GLASS CORPORATE RETREAT",
  location: "Harohalli",
  description:
    "Magnolia by Jade is a contemporary glass villa designed for structured corporate gatherings. With expansive lawns, a private home theatre, and spacious indoor areas, it supports everything from leadership workshops to large team offsites and recognition evenings.",
  perfectForTags: [
    "Corporate Offsites",
    "Leadership Retreats",
    "Brainstorming Sessions",
    "Day Outings",
    "Recognition Evenings",
    "Team Meets",
  ],
  stats: {
    ...magnolia.stats,
    stay: "30 Guests",
    events: "200 Guests",
    lawn: "30,000 sq ft Lawn",
    villaArea: "1-acre private property",
  },
  categories: [
    "Corporate Offsites",
    "Leadership Retreats",
    "Brainstorming Sessions",
    "Day Outings",
    "Recognition Evenings",
    "Team Meets",
  ],
  overlay: { onwardsPrice: "₹75,000" },
} as CorporateVillaOverlayEntry;
