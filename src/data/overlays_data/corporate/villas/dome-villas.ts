import { domeVillas } from "@/data/retreats/dome/estate";
import type { CorporateVillaOverlayEntry } from "../types";

/** Corporate overlay — source: public/Corporate_Villa_Overlay/Dome.svg */
export const domeVillasCorporateOverlay = {
  ...domeVillas,
  type: "HOBBIT-INSPIRED CORPORATE RETREAT",
  location: "Doddaballapur",
  description:
    "Dome Villas by Jade is a 2-acre hobbit-inspired corporate retreat featuring three private dome homes, expansive lawns, and dedicated outdoor spaces. Designed for corporate offsites, team celebrations, and immersive workations, the venue balances structured productivity with open-air engagement.",
  perfectForTags: [
    "Corporate Offsites",
    "Leadership Retreats",
    "Team Outings",
    "Workations",
    "Recognition Events",
  ],
  stats: {
    ...domeVillas.stats,
    stay: "30 Guests",
    events: "200 Guests",
    lawn: "1.5 Acre · Expansive Lawn",
    villaArea: "2-acre private retreat",
  },
  categories: [
    "Corporate Offsites",
    "Leadership Retreats",
    "Team Outings",
    "Workations",
    "Recognition Events",
  ],
  overlay: { onwardsPrice: "₹75,000" },
} as CorporateVillaOverlayEntry;
