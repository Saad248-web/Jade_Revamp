import { NextResponse } from "next/server"; // API cache busted for image optimizations
import { VILLAS } from "@/lib/mockData";
import { MEDIA_MANIFEST } from "@/generated/mediaManifest";
import { getHeroOverrideForId } from "@/lib/heroOverrides";
import {
  DOME_COLOR_META,
  getDomeColorFromVillaId,
  isDomeEstateId,
  isDomeVillaId,
} from "@/lib/domeVillaIds";

type CategorizedSpace = {
  id: string;
  title: string;
  category: string;
  amenities: string[];
  images: string[];
};

type MediaResponse = {
  hero: string[];
  spaces: string[];
  experiences: string[];
  perfectFor: string[];
  other: string[];
  categorizedSpaces: CategorizedSpace[];
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function extractRetreatFoldersFromPath(url: string) {
  const m = url.match(/^\/Villa_Retreats\/([^/]+)\//);
  if (!m?.[1]) return [];
  try {
    return [decodeURIComponent(m[1])];
  } catch {
    return [m[1]];
  }
}

function collectCandidateFolders(villa: any) {
  const candidates: string[] = [];
  const addFrom = (s?: string) => {
    if (!s || typeof s !== "string") return;
    candidates.push(...extractRetreatFoldersFromPath(s));
  };
  addFrom(villa.image);
  addFrom(villa.thumbnail);
  (villa.images || []).forEach(addFrom);
  (villa.spaces || []).forEach((x: any) => addFrom(x?.image));
  (villa.activities || []).forEach((x: any) => addFrom(x?.image));
  (villa.categorizedSpaces || []).forEach((g: any) =>
    (g?.images || []).forEach(addFrom),
  );
  return uniq(candidates);
}

function resolveRetreatFolders(villa: any): string[] {
  const byFolder = (MEDIA_MANIFEST as any).villasByFolder || {};

  // Deterministic: use `villa.name` as the manifest key (matches `public/Villa_Retreats/<Folder>`).
  if (villa?.name && byFolder[villa.name]) return [villa.name];

  // Dome estate + per-color dome pages use the `Dome` manifest bucket.
  if (isDomeVillaId(villa?.id) && byFolder["Dome"]) return ["Dome"];

  // Fallback: scan paths but only keep folders that exist in the manifest.
  const candidates = collectCandidateFolders(villa).filter(
    (f) => typeof f === "string" && byFolder[f],
  );
  if (candidates.length) return candidates.slice(0, 1);

  return [];
}

function filenameTitle(url: string) {
  const base = decodeURIComponent(url.split("/").pop() || "")
    .replace(/\.webp$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  return base.length ? base : "Space";
}

function detectRoomCategory(title: string) {
  const t = title.toLowerCase();
  const has = (s: string) => t.includes(s);
  if (
    has("bath") ||
    has("toilet") ||
    has("jacuzzi") ||
    has("tub") ||
    has("shower")
  )
    return "Bathrooms";
  if (has("bed") || has("suite") || has("master")) return "Bedrooms";
  if (has("kitchen") || has("bar") || has("counter")) return "Kitchen & Bar";
  if (
    has("living") ||
    has("lounge") ||
    has("dining") ||
    has("hall") ||
    has("family") ||
    has("theatre") ||
    has("theater") ||
    has("tv")
  )
    return "Living & Dining";
  if (has("pool") || has("water") || has("plunge") || has("waterfall"))
    return "Pool & Water";
  if (
    has("lawn") ||
    has("garden") ||
    has("yard") ||
    has("outdoor") ||
    has("sit out") ||
    has("sitout") ||
    has("patio") ||
    has("gazebo") ||
    has("bonfire") ||
    has("bbq") ||
    has("barbeque") ||
    has("camp") ||
    has("picnic") ||
    has("amphitheater") ||
    has("court yard") ||
    has("courtyard")
  )
    return "Outdoors & Lawns";
  if (
    has("entrance") ||
    has("walk") ||
    has("walkway") ||
    has("path") ||
    has("corridor") ||
    has("stairs") ||
    has("stair") ||
    has("gate") ||
    has("exit")
  )
    return "Entrances & Paths";
  if (
    has("view") ||
    has("hill") ||
    has("sunset") ||
    has("villa") ||
    has("front") ||
    has("exterior") ||
    has("dome") ||
    has("side view") ||
    has("glamping")
  )
    return "Views & Exteriors";
  return "Other";
}

function amenitiesFor(cat: string) {
  switch (cat) {
    case "Bedrooms":
      return ["Beds", "Sleep comfort", "Storage", "AC"];
    case "Bathrooms":
      return ["Baths", "Jacuzzi", "Shower", "Toiletries"];
    case "Living & Dining":
      return ["Living spaces", "Dining", "Lounges", "Interiors"];
    case "Kitchen & Bar":
      return ["Kitchen", "Bar counter", "Utilities", "Tableware"];
    case "Pool & Water":
      return ["Pool", "Plunge", "Water features", "Deck"];
    case "Outdoors & Lawns":
      return ["Lawns", "Garden zones", "Open-air seating", "Activities"];
    case "Entrances & Paths":
      return ["Walkways", "Entrances", "Courtyards", "Landscaping"];
    case "Views & Exteriors":
      return ["Exterior views", "Property facade", "Scenic views", "Approach"];
    default:
      return ["Spaces", "Details", "Ambience", "Highlights"];
  }
}

const SUB_CATEGORY_ORDER = [
  "Views & Exteriors",
  "Outdoors & Lawns",
  "Pool & Water",
  "Living & Dining",
  "Kitchen & Bar",
  "Bedrooms",
  "Bathrooms",
  "Entrances & Paths",
  "Other",
];

const DOMES: Array<{ id: string; label: string; needle: string }> = [
  { id: "blue", label: "Blue Dome", needle: "/Dome Villa_s - Blue/" },
  { id: "red", label: "Red Dome", needle: "/Dome Villa_s - Red/" },
  { id: "yellow", label: "Yellow Dome", needle: "/Dome Villa_s - Yellow/" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildDomeCategorizedSpaces(allImages: string[]): CategorizedSpace[] {
  const groups: CategorizedSpace[] = [];

  for (const dome of DOMES) {
    const domeImages = allImages.filter((u) => u.includes(dome.needle));
    if (!domeImages.length) continue;

    // Bucket images within this dome by room-type sub-category.
    const buckets: Record<string, string[]> = {};
    for (const url of domeImages) {
      const cat = detectRoomCategory(filenameTitle(url));
      (buckets[cat] = buckets[cat] || []).push(url);
    }

    for (const subCat of SUB_CATEGORY_ORDER) {
      const imgs = buckets[subCat];
      if (!imgs || !imgs.length) continue;
      groups.push({
        id: `${dome.id}-${slugify(subCat)}`,
        title: subCat,
        category: dome.label,
        amenities: amenitiesFor(subCat),
        images: imgs,
      });
    }
  }

  return groups;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const villa = VILLAS.find((v: any) => v.id === id);
  if (!villa) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const retreatFolders = resolveRetreatFolders(villa);
  const media = {
    hero: [],
    spaces: [],
    experiences: [],
    perfectFor: [],
    other: [],
  } as Omit<MediaResponse, "categorizedSpaces">;

  for (const folder of retreatFolders) {
    const entry = (MEDIA_MANIFEST as any).villasByFolder?.[folder];
    if (!entry) continue;
    media.hero.push(...(entry.hero || []));
    media.spaces.push(...(entry.spaces || []));
    media.experiences.push(...(entry.experiences || []));
    media.perfectFor.push(...(entry.perfectFor || []));
    media.other.push(...(entry.other || []));
  }

  const hero = uniq(media.hero);
  let spaces = uniq(media.spaces);
  let experiences = uniq(media.experiences);
  let perfectFor = uniq(media.perfectFor);
  const other = uniq(media.other);

  const heroOverride = getHeroOverrideForId(id);
  const finalHero = heroOverride ? heroOverride : hero;

  const domeColor = getDomeColorFromVillaId(id);

  // Dome Villas: pin Experiences/Perfect For to their dedicated folders, and
  // build dome-color grouped sub-categorized spaces (Blue / Red / Yellow each
  // containing Bedrooms, Pool & Water, Living & Dining, etc.).
  if (isDomeVillaId(id)) {
    experiences = experiences.filter((u) =>
      u.startsWith("/Villa_Retreats/Dome/3-Experienceee/"),
    );
    perfectFor = perfectFor.filter((u) =>
      u.startsWith("/Villa_Retreats/Dome/Perfect For/"),
    );
    const domeNeedle = domeColor ? DOME_COLOR_META[domeColor].pathNeedle : null;
    const isDomeSpace = (u: string) =>
      u.startsWith("/Villa_Retreats/Dome/Dome Villa_s - ") &&
      (!domeNeedle || u.includes(domeNeedle));
    spaces = uniq([
      ...hero.filter(isDomeSpace),
      ...spaces.filter(isDomeSpace),
    ]);
  }

  const res: MediaResponse = {
    hero: finalHero,
    spaces,
    experiences,
    perfectFor,
    other,
    categorizedSpaces: (() => {
      if (isDomeVillaId(id)) {
        const groups = buildDomeCategorizedSpaces(spaces);
        if (domeColor) {
          return groups.filter(
            (g) => g.category === DOME_COLOR_META[domeColor].categoryLabel,
          );
        }
        if (isDomeEstateId(id)) {
          return groups;
        }
        return groups;
      }
      // Use the manifest’s pre-built categories when we only have one folder.
      if (retreatFolders.length === 1) {
        const entry = (MEDIA_MANIFEST as any).villasByFolder?.[
          retreatFolders[0]
        ];
        if (entry?.categorizedSpaces?.length) return entry.categorizedSpaces;
      }
      return [
        {
          id: "all-spaces",
          title: "All Spaces",
          category: "All Spaces",
          amenities: [],
          images: spaces,
        },
      ];
    })(),
  };

  return NextResponse.json(res);
}
