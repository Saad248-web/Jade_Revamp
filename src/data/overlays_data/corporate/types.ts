import type { VillaStats } from "@/lib/types";

export type CorporateOverlayMeta = {
  onwardsPrice: string;
};

/** Corporate page overlay entry (retreat spread + SVG overrides). */
export type CorporateVillaOverlayEntry = Record<string, unknown> & {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  image: string;
  stats: VillaStats;
  perfectForTags: string[];
  categories: string[];
  overlay: CorporateOverlayMeta;
};
