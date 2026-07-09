import { NextRequest, NextResponse } from "next/server";
import {
  parseAxisRoomsInbound,
  validateAxisRoomsAccessKey,
} from "@/lib/axisRooms/parseInbound";
import { upsertAxisRoomsInbound } from "@/lib/axisRooms/upsertInboundBooking";
import {
  validateAxisRoomsInbound,
  verifyInboundWithAxis,
} from "@/lib/axisRooms/validateInbound";
import { logAxisRoomsInbound } from "@/lib/axisRooms/inboundLogger";

export const dynamic = "force-dynamic";

const SUCCESS_BODY = {
  status: "success",
  message: "Booking Update Received",
} as const;

function failureBody(message: string) {
  return { status: "failure" as const, message };
}

/** Axis Rooms API 9 — inbound OTA booking receiver. */
export async function POST(req: NextRequest) {
  if (!process.env.AXIS_ROOMS_API_KEY?.trim()) {
    return NextResponse.json(
      failureBody("AXIS_ROOMS_API_KEY not configured"),
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    await logAxisRoomsInbound({
      phase: "rejected",
      ok: false,
      error: "Invalid JSON",
      httpStatus: 400,
    });
    return NextResponse.json(failureBody("Invalid JSON"), { status: 400 });
  }

  if (!validateAxisRoomsAccessKey(payload)) {
    await logAxisRoomsInbound({
      phase: "rejected",
      ok: false,
      error: "Unauthorized",
      httpStatus: 401,
    });
    return NextResponse.json(failureBody("Unauthorized"), { status: 401 });
  }

  const parsed = parseAxisRoomsInbound(payload);
  if (!parsed) {
    await logAxisRoomsInbound({
      phase: "rejected",
      ok: false,
      error: "parse_failed",
      httpStatus: 422,
    });
    return NextResponse.json(
      failureBody("Invalid booking payload structure"),
      { status: 422 },
    );
  }

  await logAxisRoomsInbound({
    phase: "received",
    bookingNo: parsed.bookingNo,
    eventType: parsed.eventType,
    ok: true,
    metadata: {
      propertyId: parsed.propertyId,
      roomTypeId: parsed.roomTypeId,
      ratePlanId: parsed.ratePlanId,
      noOfRooms: parsed.noOfRooms,
    },
  });

  try {
    const validation = await validateAxisRoomsInbound(parsed);
    if (!validation.ok) {
      await logAxisRoomsInbound({
        phase: "rejected",
        bookingNo: parsed.bookingNo,
        eventType: parsed.eventType,
        ok: false,
        error: validation.error,
        httpStatus: 422,
        metadata: { code: validation.code },
      });
      return NextResponse.json(failureBody(validation.error), { status: 422 });
    }

    await logAxisRoomsInbound({
      phase: "validated",
      bookingNo: parsed.bookingNo,
      eventType: parsed.eventType,
      ok: true,
      metadata: {
        villaSlug: validation.villa.slug,
        mapping: validation.mapping,
      },
    });

    if (parsed.eventType !== "cancel") {
      const axisVerify = await verifyInboundWithAxis(parsed, validation.mapping);
      if (!axisVerify.ok) {
        await logAxisRoomsInbound({
          phase: "rejected",
          bookingNo: parsed.bookingNo,
          eventType: parsed.eventType,
          ok: false,
          error: axisVerify.error,
          httpStatus: 422,
          metadata: { code: "AXIS_VERIFY_FAILED" },
        });
        return NextResponse.json(
          failureBody(axisVerify.error ?? "Axis Rooms verification failed"),
          { status: 422 },
        );
      }

      await logAxisRoomsInbound({
        phase: "axis_verified",
        bookingNo: parsed.bookingNo,
        eventType: parsed.eventType,
        ok: true,
      });
    }

    const result = await upsertAxisRoomsInbound(parsed, validation);

    if (result.duplicate) {
      await logAxisRoomsInbound({
        phase: "duplicate",
        bookingNo: parsed.bookingNo,
        eventType: parsed.eventType,
        ok: true,
        metadata: { bookingId: result.bookingId },
      });
      return NextResponse.json(SUCCESS_BODY);
    }

    if (!result.ok) {
      await logAxisRoomsInbound({
        phase: "rejected",
        bookingNo: parsed.bookingNo,
        eventType: parsed.eventType,
        ok: false,
        error: result.error,
        httpStatus: 422,
        metadata: { conflict: result.conflict },
      });
      return NextResponse.json(
        failureBody(result.error ?? "Booking processing failed"),
        { status: 422 },
      );
    }

    if (result.axisInventorySync) {
      await logAxisRoomsInbound({
        phase: result.axisInventorySync.ok ? "api2_pushed" : "api2_failed",
        bookingNo: parsed.bookingNo,
        eventType: parsed.eventType,
        ok: result.axisInventorySync.ok,
        error: result.axisInventorySync.error,
        metadata: {
          api: 2,
          bookingId: result.bookingId,
          mode:
            parsed.eventType === "cancel"
              ? "open"
              : parsed.eventType === "modify"
                ? "modify"
                : "close",
        },
      });
    }

    await logAxisRoomsInbound({
      phase: "processed",
      bookingNo: parsed.bookingNo,
      eventType: parsed.eventType,
      ok: true,
      metadata: {
        bookingId: result.bookingId,
        conflict: result.conflict,
        api2Ok: result.axisInventorySync?.ok,
      },
    });

    return NextResponse.json(SUCCESS_BODY);
  } catch (e) {
    console.error("[POST /api/webhooks/axisrooms]", e);
    await logAxisRoomsInbound({
      phase: "rejected",
      bookingNo: parsed.bookingNo,
      eventType: parsed.eventType,
      ok: false,
      error: e instanceof Error ? e.message : "Internal error",
      httpStatus: 500,
    });
    return NextResponse.json(failureBody("Internal error"), { status: 500 });
  }
}
