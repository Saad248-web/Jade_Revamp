import { NextRequest, NextResponse } from "next/server";
import { auditLog } from "@/lib/audit/auditLog";
import { addDays } from "@/lib/bookingDates";
import { BOOKING_HOLD_MINUTES } from "@/lib/bookings/config";
import { generateBookingToken } from "@/lib/bookings/ids";
import { computeBookingPricing } from "@/lib/bookings/pricing";
import { getBookingStore } from "@/lib/bookings/mongoStore";
import { connectDB } from "@/lib/db";
import { VillaModel } from "@/models/Villa";
import { isMongoConfigured } from "@/lib/db";
import { requireRole } from "@/lib/auth/requireRole";
import { readJsonBody, SafeJsonError } from "@/lib/security/safeJson";
import {
  assertPlainObject,
  createBookingSchema,
} from "@/lib/security/validateInput";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const manualSchema = createBookingSchema.extend({
  paymentMode: z.enum(["external", "none", "razorpay"]).default("external"),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, "/dashboard/bookings", "write");
  if (!auth.ok) return auth.response;

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Booking service unavailable" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await readJsonBody(req, 48 * 1024);
    assertPlainObject(body);
  } catch (e) {
    if (e instanceof SafeJsonError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const parsed = manualSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;
  await connectDB();
  const villa = await VillaModel.findOne({
    slug: input.villaSlug,
    isDeleted: false,
  });
  if (!villa) {
    return NextResponse.json({ error: "Villa not found" }, { status: 404 });
  }

  if (input.guests > villa.stayMaxPax) {
    return NextResponse.json(
      {
        error: `Guest count exceeds villa maximum (${villa.stayMaxPax})`,
      },
      { status: 400 },
    );
  }

  const checkOut =
    input.bookingType === "day_out"
      ? addDays(input.checkIn, 1)
      : input.checkOut;

  try {
    const { pricing, depositPaise, errors: pricingErrors } = computeBookingPricing({
      villa: villa.toObject(),
      bookingType: input.bookingType,
      checkIn: input.checkIn,
      checkOut,
      guests: input.guests,
      adults: input.adults,
      children: input.children,
      addOns: input.addOns,
      eventTierId: input.eventTierId,
      eventGuests: input.eventGuests,
    });

    if (pricingErrors.length > 0) {
      return NextResponse.json(
        { error: pricingErrors[0].message, details: pricingErrors },
        { status: 400 },
      );
    }

    const paymentMode = input.paymentMode;
    const isPending = paymentMode === "razorpay";
    const paymentStatus =
      paymentMode === "none"
        ? "not_applicable"
        : paymentMode === "external"
          ? "external"
          : "pending";

    const store = getBookingStore();
    const record = await store.createManual({
      villaId: String(villa._id),
      villaSlug: villa.slug,
      bookingType: input.bookingType,
      checkIn: input.checkIn,
      checkOut,
      guests: input.guests,
      adults: input.adults ?? input.guests,
      children: input.children ?? 0,
      pets: input.pets ?? 0,
      guestDetails: {
        name: input.fullName,
        email: input.email.toLowerCase(),
        phone: input.phone,
      },
      notes: input.notes,
      addOns: input.addOns,
      paymentPlan: input.paymentPlan,
      pricing,
      payment: {
        gateway: paymentMode === "external" ? "external" : "razorpay",
        paymentPlan: input.paymentPlan,
        amountDuePaise: pricing.totalPaise,
        depositPaise,
        depositPaidPaise: paymentMode === "external" ? depositPaise : 0,
        balancePaise: 0,
        status: paymentStatus,
      },
      bookingToken: generateBookingToken(),
      expiresAt: new Date(Date.now() + BOOKING_HOLD_MINUTES * 60_000),
      source: "admin_manual",
      status: isPending ? "pending" : "confirmed",
    });

    await auditLog({
      action: "booking.create",
      targetType: "booking",
      targetId: record.id,
      userId: auth.userId,
      metadata: { manual: true, paymentMode },
    });

    return NextResponse.json({ booking: record }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    if (msg.includes("CONFLICT") || msg.includes("LOCK")) {
      return NextResponse.json(
        { error: "Dates not available" },
        { status: 409 },
      );
    }
    console.error("[POST /api/dashboard/bookings]", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
