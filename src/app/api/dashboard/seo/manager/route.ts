import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { withMongo } from "@/lib/api/mongoRoute";
import { runSiteSeoAudit, getSeoSiteSettings } from "@/lib/seo/siteHealth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, "/dashboard/seo/manager", "read");
  if (!auth.ok) return auth.response;

  const result = await withMongo(async () => {
    const [report, settings] = await Promise.all([
      runSiteSeoAudit(),
      getSeoSiteSettings(),
    ]);
    return { report, settings };
  });
  if (result instanceof NextResponse) return result;
  return NextResponse.json(result);
}
