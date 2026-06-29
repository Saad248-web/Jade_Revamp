import { NextRequest, NextResponse } from "next/server";
import { auditLog } from "@/lib/audit/auditLog";
import {
  parseAxisRoomsInbound,
  validateAxisRoomsAccessKey,
} from "@/lib/axisRooms/parseInbound";
import { upsertAxisRoomsInbound } from "@/lib/axisRooms/upsertInboundBooking";

export const dynamic = "force-dynamic";

const SUCCESS_BODY = {
  status: "success",
  message: "Booking Update Received",
} as const;

/** Axis Rooms API 9 — inbound OTA booking receiver. */
export async function POST(req: NextRequest) {
  if (!process.env.AXIS_ROOMS_API_KEY?.trim()) {
    return NextResponse.json(
      {
        status: "failure",
        message: "AXIS_ROOMS_API_KEY not configured",
      },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { status: "failure", message: "Invalid JSON" },
      { status: 400 },
    );
  }

  if (!validateAxisRoomsAccessKey(payload)) {
    return NextResponse.json(
      { status: "failure", message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const parsed = parseAxisRoomsInbound(payload);
    if (!parsed) {
      await auditLog({
        action: "axisrooms.inbound",
        targetType: "webhook",
        metadata: { error: "parse_failed" },
      });
      return NextResponse.json(SUCCESS_BODY);
    }

    const result = await upsertAxisRoomsInbound(parsed);

    await auditLog({
      action: "axisrooms.inbound",
      targetType: "webhook",
      targetId: result.bookingId,
      metadata: {
        eventType: parsed.eventType,
        bookingNo: parsed.bookingNo,
        conflict: result.conflict,
        duplicate: result.duplicate,
        error: result.error,
      },
    });

    return NextResponse.json(SUCCESS_BODY);
  } catch (e) {
    console.error("[POST /api/webhooks/axisrooms]", e);
    return NextResponse.json(
      { status: "failure", message: "Internal error" },
      { status: 500 },
    );
  }
}
