import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth/requireRole";
import { VillaModel } from "@/models/Villa";
import { getMergedPublishedPosts } from "@/lib/cms/blogStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jadehospitainment.com";

/** Sitemap URL inventory for SEO dashboard. */
export async function GET(req: NextRequest) {
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

  try {
    await connectDB();
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

    return NextResponse.json({ urls, total: urls.length, base: BASE });
  } catch (e) {
    console.error("[GET /api/dashboard/seo/sitemap]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
