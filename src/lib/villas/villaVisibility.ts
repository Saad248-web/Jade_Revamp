import type { Villa } from "@/lib/types";

type VillaDocLike = {
  status?: string;
  bookable?: boolean;
  content?: Record<string, unknown>;
};

function contentOf(doc: VillaDocLike) {
  return (doc.content ?? {}) as { hideFromVillasDirectory?: boolean };
}

/** Villa is removed from /villas directory (status hidden or explicit flag). */
export function isHiddenFromVillasDirectory(
  doc: VillaDocLike,
  staticFallback?: Pick<Villa, "hideFromVillasDirectory">,
): boolean {
  if (doc.status === "hidden") return true;
  const content = contentOf(doc);
  if (content.hideFromVillasDirectory === true) return true;
  if (content.hideFromVillasDirectory === false) return false;
  return staticFallback?.hideFromVillasDirectory ?? false;
}

/** Public detail route should 404 — admin-only / fully hidden. */
export function isVillaPubliclyHidden(doc: VillaDocLike): boolean {
  return doc.status === "hidden";
}

/** Directory card + detail CTA — online booking allowed. */
export function isVillaRecordBookable(villa: {
  id: string;
  bookable?: boolean;
}): boolean {
  return villa.bookable !== false;
}

/** Keep Mongo flags aligned when status changes in dashboard saves. */
export function syncVillaVisibilityFlags(villa: VillaDocLike): void {
  if (!villa.content) villa.content = {};
  const content = contentOf(villa);
  if (villa.status === "hidden") {
    content.hideFromVillasDirectory = true;
    villa.bookable = false;
    villa.content = content as Record<string, unknown>;
  }
}

export function directoryHiddenForMergedVilla(
  doc: VillaDocLike,
  staticVilla?: Villa,
): boolean {
  return isHiddenFromVillasDirectory(doc, staticVilla);
}
