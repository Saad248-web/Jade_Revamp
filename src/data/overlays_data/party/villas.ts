import {
  domeVillas,
  emerald,
  magnolia,
  tranquil,
  wonderland,
} from "@/data/retreats";

export const PARTY_VILLAS_OVERLAY_DATA = {
  "dome-villas": {
    ...domeVillas,
    overlay: { onwardsPrice: "₹35,000 per night" },
  },
  emerald: {
    ...emerald,
    overlay: { onwardsPrice: "₹65,000 per night onwards" },
  },
  magnolia: {
    ...magnolia,
    overlay: { onwardsPrice: "₹50,000 per night" },
  },
  tranquil: {
    ...tranquil,
    overlay: { onwardsPrice: "₹70,000 per night onwards" },
  },
  wonderland: {
    ...wonderland,
    overlay: { onwardsPrice: "₹30,000 per night onwards" },
  },
} as const;

