import { CORPORATE_VILLAS_OVERLAY_DATA } from "@/data/overlays_data/corporate/villas";
import { PARTY_VILLAS_OVERLAY_DATA } from "@/data/overlays_data/party/villas";
import { WEDDING_VILLAS_OVERLAY_DATA } from "@/data/overlays_data/wedding/villas";

export type OverlayPageKey = "wedding" | "weekend" | "corporate" | "party";

const MAP = {
  wedding: WEDDING_VILLAS_OVERLAY_DATA,
  weekend: {} as const,
  corporate: CORPORATE_VILLAS_OVERLAY_DATA,
  party: PARTY_VILLAS_OVERLAY_DATA,
} as const;

export function getOverlayVillaData(page: OverlayPageKey, villaId?: string) {
  if (!villaId) return null;
  return (MAP as any)[page]?.[villaId] ?? null;
}

