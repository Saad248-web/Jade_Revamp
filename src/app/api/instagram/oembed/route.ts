import { NextResponse } from "next/server";

type InstagramPost = {
  id: string;
  type: "p" | "reel";
};

type OEmbedOk = {
  thumbnail_url?: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
};

function buildInstagramUrl(post: InstagramPost) {
  return `https://www.instagram.com/${post.type}/${post.id}/`;
}

async function fetchOembed(url: string) {
  // Public oEmbed endpoint (no token). Instagram may rate-limit; we handle failures per-item.
  const endpoint = `https://www.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint, {
    // Cache on the server to reduce churn/rate-limit.
    next: { revalidate: 60 * 60 * 12 },
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Jade_ReVamp/1.0)",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`oEmbed request failed (${res.status})`);
  }
  return (await res.json()) as OEmbedOk;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const posts = (body as any)?.posts as InstagramPost[] | undefined;
  if (!Array.isArray(posts) || posts.length === 0) {
    return NextResponse.json({ error: "Missing posts[]" }, { status: 400 });
  }

  const unique = new Map<string, InstagramPost>();
  for (const p of posts) {
    if (!p?.id || (p?.type !== "p" && p?.type !== "reel")) continue;
    unique.set(`${p.type}:${p.id}`, { id: p.id, type: p.type });
  }

  const entries = Array.from(unique.entries());

  // Fetch in parallel, but keep it reasonably bounded.
  const chunkSize = 5;
  const results: Record<
    string,
    { url: string; thumbnailUrl?: string; ok: boolean }
  > = {};

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const chunkRes = await Promise.allSettled(
      chunk.map(async ([key, post]) => {
        const url = buildInstagramUrl(post);
        const oembed = await fetchOembed(url);
        return {
          key,
          url,
          thumbnailUrl: oembed.thumbnail_url,
        };
      }),
    );

    for (let idx = 0; idx < chunk.length; idx++) {
      const [key, post] = chunk[idx];
      const url = buildInstagramUrl(post);
      const r = chunkRes[idx];
      if (r.status === "fulfilled") {
        results[key] = { url, thumbnailUrl: r.value.thumbnailUrl, ok: true };
      } else {
        results[key] = { url, ok: false };
      }
    }
  }

  return NextResponse.json({ items: results });
}

