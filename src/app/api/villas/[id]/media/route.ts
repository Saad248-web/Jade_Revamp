import { NextResponse } from "next/server";
import { VILLAS } from "@/lib/mockData";
import { MEDIA_MANIFEST } from "@/generated/mediaManifest";

type MediaResponse = {
  hero: string[];
  spaces: string[];
  experiences: string[];
  perfectFor: string[];
  other: string[];
  categorizedSpaces: Array<{
    id: string;
    title: string;
    category: string;
    amenities: string[];
    images: string[];
  }>;
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function extractRetreatFoldersFromPath(url: string) {
  const m = url.match(/^\/Villa_Retreats\/([^/]+)\//);
  return m?.[1] ? [m[1]] : [];
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const villa = VILLAS.find((v: any) => v.id === id);
  if (!villa) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const retreatFolders = collectCandidateFolders(villa);
  const media = { hero: [], spaces: [], experiences: [], perfectFor: [], other: [] } as Omit<
    MediaResponse,
    "categorizedSpaces"
  >;

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
  const spaces = uniq(media.spaces);
  const experiences = uniq(media.experiences);
  const perfectFor = uniq(media.perfectFor);
  const other = uniq(media.other);

  const res: MediaResponse = {
    hero,
    spaces,
    experiences,
    perfectFor,
    other,
    categorizedSpaces: (() => {
      // Use the manifest’s pre-built categories when we only have one folder.
      if (retreatFolders.length === 1) {
        const entry = (MEDIA_MANIFEST as any).villasByFolder?.[retreatFolders[0]];
        if (entry?.categorizedSpaces?.length) return entry.categorizedSpaces;
      }
      // Otherwise, fall back to a simple single-group bucket.
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

