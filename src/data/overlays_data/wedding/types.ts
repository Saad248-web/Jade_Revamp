import type { VillaStats } from "@/lib/types";

export type WeddingOverlayMeta = {
  onwardsPrice: string;
  parking: string;
};

/** Wedding page overlay entry (retreat spread + SVG overrides). */
export type WeddingVillaOverlayEntry = Record<string, unknown> & {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  image: string;
  stats: VillaStats;
  perfectForTags: string[];
  categories: string[];
  overlay: WeddingOverlayMeta;
};
