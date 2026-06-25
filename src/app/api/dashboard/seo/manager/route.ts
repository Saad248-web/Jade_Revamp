import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { runSiteSeoAudit, getSeoSiteSettings } from "@/lib/seo/siteHealth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, "/dashboard/seo/manager", "read");
  if (!auth.ok) return auth.response;

  try {
    const refresh = req.nextUrl.searchParams.get("refresh") === "1";
    const [report, settings] = await Promise.all([
      runSiteSeoAudit(),
      getSeoSiteSettings(),
    ]);
    return NextResponse.json({ report, settings });
  } catch (e) {
    console.error("[GET /api/dashboard/seo/manager]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
