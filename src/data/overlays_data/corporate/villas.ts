import {
  domeVillas,
  magnolia,
  diamond,
  retreatOnTheRidge,
  haven,
} from "@/data/retreats";

export const CORPORATE_VILLAS_OVERLAY_DATA = {
  "dome-villas": {
    ...domeVillas,
    overlay: { onwardsPrice: "₹75,000" },
  },
  magnolia: {
    ...magnolia,
    overlay: { onwardsPrice: "₹75,000" },
  },
  diamond: {
    ...diamond,
    overlay: { onwardsPrice: "₹75,000" },
  },
  "retreat-on-the-ridge": {
    ...retreatOnTheRidge,
    overlay: { onwardsPrice: "₹75,000" },
  },
  haven: {
    ...haven,
    overlay: { onwardsPrice: "₹75,000" },
  },
} as const;

