import {
  domeVillas,
  blueDomeVilla,
  redDomeVilla,
  yellowDomeVilla,
  magnolia,
  haven,
  tranquil,
  retreatOnTheRidge,
} from "@/data/retreats";

const domeOverlay = { onwardsPrice: "₹75,000", parking: "20+" } as const;

export const WEEKEND_VILLAS_OVERLAY_DATA = {
  "dome-villas": {
    ...domeVillas,
    overlay: domeOverlay,
  },
  "dome-villas-blue": { ...blueDomeVilla, overlay: domeOverlay },
  "dome-villas-red": { ...redDomeVilla, overlay: domeOverlay },
  "dome-villas-yellow": { ...yellowDomeVilla, overlay: domeOverlay },
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

