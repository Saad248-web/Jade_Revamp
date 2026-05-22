import {
  domeVillas,
  haven,
  retreatOnTheRidge,
  tranquil,
  magnolia,
  diamond,
} from "@/data/retreats";

export const WEDDING_VILLAS_OVERLAY_DATA = {
  "dome-villa-retreats": {
    ...domeVillas,
    overlay: { onwardsPrice: "₹75,000", parking: "80" },
  },
  haven: {
    ...haven,
    overlay: { onwardsPrice: "₹75,000", parking: "80" },
  },
  "retreat-on-the-ridge": {
    ...retreatOnTheRidge,
    overlay: { onwardsPrice: "₹75,000", parking: "80" },
  },
  tranquil: {
    ...tranquil,
    overlay: { onwardsPrice: "₹65,000", parking: "80" },
  },
  magnolia: {
    ...magnolia,
    overlay: { onwardsPrice: "₹99,000", parking: "80" },
  },
  diamond: {
    ...diamond,
    overlay: { onwardsPrice: "₹99,000", parking: "80" },
  },
} as const;

