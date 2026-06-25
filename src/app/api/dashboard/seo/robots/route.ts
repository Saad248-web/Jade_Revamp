import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { getSeoSiteSettings } from "@/lib/seo/siteHealth";
import { connectDB } from "@/lib/db";
import { SeoSiteSettingsModel } from "@/models/SeoSiteSettings";

export const dynamic = "force-dynamic";

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /book
Disallow: /book/
Disallow: /menu
Disallow: /api/
Disallow: /admin
Disallow: /admin/
Disallow: /wishlist
Disallow: /wishlist/
Disallow: /dashboard
Disallow: /login

Sitemap: https://jadehospitainment.com/sitemap.xml
Host: https://jadehospitainment.com`;

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, "/dashboard/seo/manager", "read");
  if (!auth.ok) return auth.response;

  const settings = await getSeoSiteSettings();
  const override = (settings as { robotsTxtOverride?: string | null })?.robotsTxtOverride;
  return NextResponse.json({
    content: override ?? DEFAULT_ROBOTS,
    isOverride: Boolean(override),
    defaultContent: DEFAULT_ROBOTS,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireRole(req, "/dashboard/seo/manager", "write");
  if (!auth.ok) return auth.response;

  try {
    const body = (await req.json()) as { content?: string | null; restoreDefault?: boolean };
    await connectDB();

    const update =
      body.restoreDefault === true
        ? { robotsTxtOverride: null }
        : { robotsTxtOverride: body.content ?? null };

    const doc = await SeoSiteSettingsModel.findOneAndUpdate(
      { key: "default" },
      { $set: update },
      { upsert: true, new: true },
    );

    return NextResponse.json({ settings: doc });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
