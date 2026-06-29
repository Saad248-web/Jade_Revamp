import { NextRequest, NextResponse } from "next/server";
import { auditLog } from "@/lib/audit/auditLog";
import { syncVillaChannelState } from "@/lib/axisRooms/sync";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth/requireRole";
import { VillaModel } from "@/models/Villa";
import {
  applyVillaUpdate,
  toAdminVilla,
  updateVillaSchema,
} from "@/lib/villas/adminVilla";
import { revalidateVillaPublicPaths } from "@/lib/villas/revalidateVillaPaths";
import { assertPlainObject } from "@/lib/security/validateInput";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" } as const;

/** Villa pricing & capacity detail (admin write, dev read). */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const auth = await requireRole(req, "/dashboard/settings/villas", "read");
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const villa = await VillaModel.findOne({
      slug: params.slug,
      isDeleted: false,
    }).lean();
    if (!villa) {
      return NextResponse.json(
        { error: "Villa not found" },
        { status: 404, headers: noStore },
      );
    }
    return NextResponse.json(
      { villa: toAdminVilla(villa as never) },
      { headers: noStore },
    );
  } catch (e) {
    console.error("[GET /api/dashboard/villas/[slug]]", e);
    return NextResponse.json(
      { error: "Failed to load villa" },
      { status: 500, headers: noStore },
    );
  }
}

/** Update villa pricing, capacity, tax, and availability flags. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const auth = await requireRole(req, "/dashboard/settings/villas", "write");
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
    assertPlainObject(body);
  } catch {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400, headers: noStore },
    );
  }

  const parsed = updateVillaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400, headers: noStore },
    );
  }

  try {
    await connectDB();
    const villa = await VillaModel.findOne({
      slug: params.slug,
      isDeleted: false,
    });
    if (!villa) {
      return NextResponse.json(
        { error: "Villa not found" },
        { status: 404, headers: noStore },
      );
    }

    const applied = applyVillaUpdate(villa as never, parsed.data);
    await villa.save();

    await auditLog({
      action: "villa.update",
      targetType: "villa",
      targetId: String(villa._id),
      userId: auth.userId,
      metadata: { slug: params.slug, ...applied },
    });

    revalidateVillaPublicPaths({
      slug: params.slug,
      retreatId: villa.retreatId ?? params.slug,
    });

    const channelFieldsChanged =
      applied.status !== undefined ||
      applied.bookable !== undefined ||
      applied.basePriceRupees !== undefined;
    const axisSync = channelFieldsChanged
      ? await syncVillaChannelState(villa as never)
      : undefined;

    return NextResponse.json(
      { villa: toAdminVilla(villa as never), axisSync },
      { headers: noStore },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to update villa";
    console.error("[PATCH /api/dashboard/villas/[slug]]", e);
    return NextResponse.json(
      { error: msg },
      { status: 400, headers: noStore },
    );
  }
}
