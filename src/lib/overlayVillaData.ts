import { CORPORATE_VILLAS_OVERLAY_DATA } from "@/data/overlays_data/corporate/villas/index";
import { PARTY_VILLAS_OVERLAY_DATA } from "@/data/overlays_data/party/villas";
import { WEDDING_VILLAS_OVERLAY_DATA } from "@/data/overlays_data/wedding/villas/index";
import { VILLAS } from "@/lib/mockData";
import type { VillaAmenity, VillaAmenityHighlight } from "@/lib/types";
import { amenityHighlightsFrom } from "@/lib/villaDetailData";

export type OverlayPageKey = "wedding" | "weekend" | "corporate" | "party";

const MAP = {
  wedding: WEDDING_VILLAS_OVERLAY_DATA,
  weekend: {} as const,
  corporate: CORPORATE_VILLAS_OVERLAY_DATA,
  party: PARTY_VILLAS_OVERLAY_DATA,
} as const;

type OverlayVillaLike = {
  id?: string;
  amenities?: VillaAmenity[];
  amenityHighlights?: VillaAmenityHighlight[];
};

/** Keep overlay amenity tiles aligned with retreat source records. */
export function syncOverlayAmenityFields<T extends OverlayVillaLike>(
  overlayVilla: T,
): T {
  const retreat = VILLAS.find((villa) => villa.id === overlayVilla.id);
  if (!retreat) return overlayVilla;

  const amenities =
    overlayVilla.amenities?.length ? overlayVilla.amenities : retreat.amenities;
  const amenityHighlights = overlayVilla.amenityHighlights?.length
    ? overlayVilla.amenityHighlights
    : retreat.amenityHighlights?.length
      ? retreat.amenityHighlights
      : amenityHighlightsFrom(amenities ?? []);

  return {
    ...overlayVilla,
    amenities,
    amenityHighlights,
  };
}

export function getOverlayVillaData(page: OverlayPageKey, villaId?: string) {
  if (!villaId) return null;
  const entry = (MAP as Record<string, Record<string, OverlayVillaLike>>)[page]?.[
    villaId
  ];
  if (!entry) return null;
  return syncOverlayAmenityFields(entry);
}

