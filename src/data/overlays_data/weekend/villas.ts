import {
  domeVillas,
  magnolia,
  haven,
  tranquil,
  retreatOnTheRidge,
} from "@/data/retreats";

export const WEEKEND_VILLAS_OVERLAY_DATA = {
  "dome-villas": {
    ...domeVillas,
    overlay: { onwardsPrice: "₹75,000", parking: "20+" },
  },
  magnolia: {
    ...magnolia,
    overlay: { onwardsPrice: "₹99,000", parking: "20+" },
  },
  haven: {
    ...haven,
    overlay: { onwardsPrice: "₹75,000", parking: "20+" },
  },
  tranquil: {
    ...tranquil,
    overlay: { onwardsPrice: "₹65,000", parking: "20+" },
  },
  "retreat-on-the-ridge": {
    ...retreatOnTheRidge,
    overlay: { onwardsPrice: "₹75,000", parking: "20+" },
  },
} as const;

