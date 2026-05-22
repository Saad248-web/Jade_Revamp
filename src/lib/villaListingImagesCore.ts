import { MEDIA_MANIFEST } from "@/generated/mediaManifest";
import { getHeroOverrideForId } from "@/lib/heroOverrides";
import { prettyMediaLabel } from "@/lib/mediaLabels";
export type VillaGalleryItem = { name: string; image: string };

export type VillaListingImagesInput = {
  id: string;
  name?: string;
  image?: string;
};

type CategorizedSpace = {
  title?: string;
  category?: string;
  images?: string[];
};

export type VillaListingServerMedia = {
  hero?: string[];
  categorizedSpaces?: CategorizedSpace[];
};

const validImage = (img: string | undefined) => Boolean(img && img.length > 0);

export function getVillaManifestEntry(villa: { name?: string; image?: string }) {
  const byName = villa.name
    ? (MEDIA_MANIFEST as { villasByFolder?: Record<string, unknown> }).villasByFolder?.[
        villa.name
      ]
    : null;
  if (byName) return byName as {
    hero?: string[];
    spaces?: string[];
    categorizedSpaces?: CategorizedSpace[];
  };
  const m = (villa.image || "").match(/^\/Villa_Retreats\/([^/]+)\//);
  if (!m?.[1]) return null;
  const folder = (MEDIA_MANIFEST as { villasByFolder?: Record<string, unknown> })
    .villasByFolder;
  try {
    return (folder?.[decodeURIComponent(m[1])] ?? folder?.[m[1]]) as {
      hero?: string[];
      spaces?: string[];
      categorizedSpaces?: CategorizedSpace[];
    } | null;
  } catch {
    return (folder?.[m[1]] ?? null) as {
      hero?: string[];
      spaces?: string[];
      categorizedSpaces?: CategorizedSpace[];
    } | null;
  }
}

/** Same carousel sources as `/villas` VillaCard (manifest + optional API media). */
export function buildVillaListingImages(
  villa: VillaListingImagesInput | null | undefined,
  serverMedia?: VillaListingServerMedia | null,
): VillaGalleryItem[] {
  if (!villa?.id) return [{ name: "Main", image: "" }];

  const list: VillaGalleryItem[] = [];
  const manifestEntry = getVillaManifestEntry(villa);
  const heroFromApi = serverMedia?.hero?.[0];
  const manifestHero = manifestEntry?.hero?.[0];
  const overrideHero = getHeroOverrideForId(villa.id)?.[0];
  const hero = validImage(heroFromApi)
    ? heroFromApi
    : validImage(overrideHero)
      ? overrideHero
      : validImage(manifestHero)
        ? manifestHero
        : villa.image;
  if (validImage(hero)) list.push({ name: "Main", image: hero as string });

  const cat = (
    serverMedia?.categorizedSpaces ||
    manifestEntry?.categorizedSpaces ||
    []
  )
    .map((g) => {
      const img = g.images?.find((x) => validImage(x));
      if (!img) return null;
      const title = g.title || g.category || "Space";
      return { name: title, image: img };
    })
    .filter(Boolean) as VillaGalleryItem[];

  if (cat.length > 0) {
    return [
      ...list,
      ...cat.map((x) => ({
        name: prettyMediaLabel({
          url: x.image,
          fallback: x.name,
          kind: "space",
        }),
        image: x.image,
      })),
    ];
  }

  const manifestSpaces = (manifestEntry?.spaces || [])
    .filter((img) => validImage(img))
    .slice(0, 6)
    .map((img, i) => ({
      name: prettyMediaLabel({
        url: img,
        fallback: `Space ${i + 1}`,
        kind: "space",
      }),
      image: img,
    }));
  if (manifestSpaces.length > 0) return list.concat(manifestSpaces);
  if (list.length > 0) return list;
  return [{ name: "Main", image: villa.image || "" }];
}

export function primaryVillaListingImage(
  images: VillaGalleryItem[],
  fallback?: string,
) {
  return images.find((i) => validImage(i.image))?.image || fallback || "";
}
