import { NextRequest, NextResponse } from "next/server";
import { auditLog } from "@/lib/audit/auditLog";
import { getBookingStore } from "@/lib/bookings/mongoStore";
import { isBookingRef } from "@/lib/bookings/ids";
import { issueRazorpayRefund } from "@/lib/payments/refund";
import { requireRole } from "@/lib/auth/requireRole";
import { readJsonBody, SafeJsonError } from "@/lib/security/safeJson";
import { assertPlainObject } from "@/lib/security/validateInput";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("cancel"),
    reason: z.string().max(500).optional(),
  }),
  z.object({
    action: z.literal("refund"),
    reason: z.string().max(500).optional(),
    refundPaise: z.number().int().min(1).optional(),
  }),
  z.object({
    action: z.literal("notes"),
    notes: z.string().max(2000),
  }),
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireRole(req, "/dashboard/bookings", "write");
  if (!auth.ok) return auth.response;

  if (!isBookingRef(params.id)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(req, 16 * 1024);
    assertPlainObject(body);
  } catch (e) {
    if (e instanceof SafeJsonError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const store = getBookingStore();

  try {
    if (parsed.data.action === "notes") {
      const updated = await store.updateNotes(params.id, parsed.data.notes);
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      await auditLog({
        action: "booking.update",
        targetType: "booking",
        targetId: params.id,
        userId: auth.userId,
        metadata: { notes: true },
      });
      return NextResponse.json({ booking: updated });
    }

    if (parsed.data.action === "cancel") {
      const updated = await store.cancelBooking(params.id, auth.userId);
      if (!updated) {
        return NextResponse.json(
          { error: "Not found or already cancelled" },
          { status: 404 },
        );
      }
      return NextResponse.json({ booking: updated });
    }

    const result = await issueRazorpayRefund({
      bookingId: params.id,
      reason: parsed.data.reason ?? "staff_manual_refund",
      userId: auth.userId,
      refundPaise: parsed.data.refundPaise,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Refund failed" },
        { status: 400 },
      );
    }
    const booking = await store.findById(params.id);
    return NextResponse.json({ ok: true, booking });
  } catch (e) {
    console.error("[PATCH /api/dashboard/bookings/[id]]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
