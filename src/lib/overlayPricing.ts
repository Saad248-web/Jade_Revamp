import { CORPORATE_PRICING_ONWARDS } from "@/data/overlays_data/corporate/pricing";
import { PARTY_PRICING_ONWARDS } from "@/data/overlays_data/party/pricing";
import { WEEKEND_PRICING_ONWARDS } from "@/data/overlays_data/weekend/pricing";
import { WEDDING_PRICING_ONWARDS } from "@/data/overlays_data/wedding/pricing";

export type OverlayPageKey = "wedding" | "weekend" | "corporate" | "party";

const MAP: Record<OverlayPageKey, Record<string, string>> = {
  wedding: WEDDING_PRICING_ONWARDS,
  weekend: WEEKEND_PRICING_ONWARDS,
  corporate: CORPORATE_PRICING_ONWARDS,
  party: PARTY_PRICING_ONWARDS,
};

export function getOverlayOnwardsPrice(
  page: OverlayPageKey,
  villaId?: string,
) {
  const cfg = MAP[page];
  if (!cfg) return null;
  if (villaId && cfg[villaId]) return cfg[villaId];
  return cfg.default ?? null;
}

