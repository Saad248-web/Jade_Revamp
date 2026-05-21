import { INSTAGRAM_POSTS } from "@/data/instagramPosts";

export type InstagramOembedItem = {
  url: string;
  thumbnailUrl?: string;
  ok: boolean;
};

let cache: Record<string, InstagramOembedItem> | null = null;
let inflight: Promise<Record<string, InstagramOembedItem>> | null = null;
let imagesPrefetched = false;

export function getCachedInstagramOembed(): Record<string, InstagramOembedItem> | null {
  return cache;
}

/** Decode fallback WebP/JPEG before the section mounts (cheap vs 20 cards at once). */
export function prefetchInstagramFallbackImages(): void {
  if (typeof window === "undefined" || imagesPrefetched) return;
  imagesPrefetched = true;

  const run = () => {
    for (const post of INSTAGRAM_POSTS) {
      const img = new Image();
      img.decoding = "async";
      img.src = post.fallbackImage;
    }
  };

  if ("requestIdleCallback" in window) {
    (
      window as Window & {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void;
      }
    ).requestIdleCallback(run, { timeout: 1200 });
  } else {
    setTimeout(run, 200);
  }
}

/** Warm oEmbed + images as early as possible on the home page. */
export function prefetchInstagramOembed(): void {
  if (typeof window === "undefined") return;

  prefetchInstagramFallbackImages();

  if (cache || inflight) return;

  const run = () => {
    void fetchInstagramOembed();
  };

  if ("requestIdleCallback" in window) {
    (
      window as Window & {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void;
      }
    ).requestIdleCallback(run, { timeout: 800 });
  } else {
    setTimeout(run, 150);
  }
}

export async function fetchInstagramOembed(): Promise<
  Record<string, InstagramOembedItem>
> {
  if (cache) return cache;
  if (inflight) return inflight;

  const posts = INSTAGRAM_POSTS.map((p) => ({ id: p.id, type: p.type }));

  inflight = fetch("/api/instagram/oembed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ posts }),
  })
    .then((res) => res.json())
    .then((data) => {
      const items = (data?.items || {}) as Record<string, InstagramOembedItem>;
      cache = items;
      return items;
    })
    .catch(() => {
      cache = {};
      return {};
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
