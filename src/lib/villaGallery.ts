import { getHeroOverrideForId } from "@/lib/heroOverrides";

export type VillaGalleryItem = { name: string; image: string };

const normalizePublicImageSrc = (src: string) => {
  if (!src.startsWith("/")) return src;
  return src.replace(/ /g, "%20").replace(/#/g, "%23").replace(/\?/g, "%3F");
};

export function buildVillaGalleryItems(villa: any, max = 8): VillaGalleryItem[] {
  const sources: Array<string | undefined | null> = [
    ...(getHeroOverrideForId(villa?.id) || []),
    ...((villa?.images as string[] | undefined) || []),
    ...(((villa?.spaces as any[] | undefined) || []).map((s) => s?.image)),
    ...(((villa?.activities as any[] | undefined) || []).map((a) => a?.image)),
    villa?.image,
  ];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of sources) {
    if (!raw || typeof raw !== "string") continue;
    const normalized = normalizePublicImageSrc(raw);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= max) break;
  }

  return out.map((img, idx) => ({ name: `Gallery ${idx + 1}`, image: img }));
}

