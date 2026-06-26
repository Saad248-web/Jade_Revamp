import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { withMongo } from "@/lib/api/mongoRoute";
import { VillaModel } from "@/models/Villa";
import { getMergedPublishedPosts } from "@/lib/cms/blogStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jadehospitainment.com";

/** Sitemap URL inventory for SEO dashboard. */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole(req, "/dashboard/seo/sitemap", "read");
    if (!auth.ok) return auth.response;

    const staticPaths = [
      "/",
      "/villas",
      "/weddings",
      "/experiences",
      "/weekend-getaways",
      "/corporate-retreats",
      "/party-villas",
      "/book",
      "/blogs",
      "/about",
      "/contact",
      "/careers",
      "/privacy",
    ];

    const result = await withMongo(async () => {
      const villas = await VillaModel.find({
        isDeleted: false,
        status: { $ne: "hidden" },
        "content.hideFromVillasDirectory": { $ne: true },
      })
        .select("slug")
        .lean();

      const blogPosts = await getMergedPublishedPosts();
      const urls = [
        ...staticPaths.map((path) => ({
          loc: `${BASE}${path === "/" ? "" : path}`,
          type: "static" as const,
          priority: path === "/" ? 1 : 0.8,
        })),
        ...villas.map((v) => ({
          loc: `${BASE}/villas/${v.slug}`,
          type: "villa" as const,
          priority: 0.85,
        })),
        ...blogPosts.map((p) => ({
          loc: `${BASE}/blogs/${p.slug}`,
          type: "blog" as const,
          priority: 0.7,
        })),
      ];

      return { urls, total: urls.length, base: BASE };
    });

    if (result instanceof NextResponse) return result;
    return NextResponse.json(result);
  } catch (e) {
    console.error("[GET /api/dashboard/seo/sitemap] unhandled", e);
    const detail = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json(
      { error: "Failed to load sitemap", code: "SITEMAP_ERROR", detail },
      { status: 500 },
    );
  }
}
