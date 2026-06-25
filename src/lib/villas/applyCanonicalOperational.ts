import {
  CANONICAL_BY_RETREAT_ID,
  type CanonicalVilla,
} from "./canonicalPortfolio";
import { resolveCanonicalForRetreat } from "./canonicalOverlayHelpers";
import { buildPricingDisplay } from "./pricingDisplay";
import { applyMdContentPatch } from "./retreatMdContent";

export function enrichVilla<T extends { id: string }>(villa: T): T {
  const canonical = resolveCanonicalForRetreat(villa.id);
  const withMd = applyMdContentPatch(villa);
  if (!canonical) return withMd;
  return applyCanonical(withMd, canonical);
}

function applyCanonical<T extends { id: string }>(
  villa: T,
  c: CanonicalVilla,
): T {
  const pricing = buildPricingDisplay(c);
  const withThumb = villa as T & { thumbnail?: string };
  return {
    ...villa,
    name: c.shortName,
    type: c.type,
    location: c.location,
    stats: { ...(villa as { stats?: Record<string, string> }).stats, ...c.stats },
    pricing,
    bookable: c.bookable,
    ...(!withThumb.thumbnail && c.thumbnail ? { thumbnail: c.thumbnail } : {}),
  } as T;
}

export function enrichAllVillas<T extends { id: string }>(villas: T[]): T[] {
  return villas.map(enrichVilla);
}
