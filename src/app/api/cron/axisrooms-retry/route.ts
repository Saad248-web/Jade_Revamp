import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import {
  pushAxisRoomsCancellation,
  pushAxisRoomsReservation,
} from "@/lib/axisRooms/client";

export const dynamic = "force-dynamic";

function verifyCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!verifyCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.AXIS_ROOMS_API_KEY?.trim()) {
    return NextResponse.json({
      ok: true,
      blocked: "AXIS_ROOMS_API_KEY not configured — see NEEDS_FROM_USER.md",
      processed: 0,
    });
  }

  try {
    await connectDB();
    const pending = await BookingModel.find({
      $or: [
        {
          status: "confirmed",
          axisRoomsSynced: false,
          axisRoomsSyncAttempts: { $lt: 10 },
        },
        {
          status: { $in: ["cancelled", "conflict"] },
          axisRoomsCancelSynced: false,
          axisRoomsSyncAttempts: { $lt: 10 },
        },
      ],
    }).limit(20);

    let processed = 0;
    for (const b of pending) {
      let succeeded = false;
      try {
        if (b.status === "confirmed" && !b.axisRoomsSynced) {
          const result = await pushAxisRoomsReservation(b);
          if (result.ok) {
            b.axisRoomsSynced = true;
            if (result.reservationId) {
              b.axisRoomsReservationId = result.reservationId;
            }
            b.axisRoomsLastError = undefined;
            succeeded = true;
          } else {
            b.axisRoomsLastError = result.error ?? "push failed";
          }
        } else if (
          ["cancelled", "conflict"].includes(b.status) &&
          !b.axisRoomsCancelSynced
        ) {
          const result = await pushAxisRoomsCancellation(b);
          if (result.ok) {
            b.axisRoomsCancelSynced = true;
            b.axisRoomsLastError = undefined;
            succeeded = true;
          } else {
            b.axisRoomsLastError = result.error ?? "cancel failed";
          }
        }
        processed += 1;
      } catch (e) {
        b.axisRoomsLastError = e instanceof Error ? e.message : "unknown";
      }
      if (!succeeded) {
        b.axisRoomsSyncAttempts = (b.axisRoomsSyncAttempts ?? 0) + 1;
      }
      await b.save();
    }

    return NextResponse.json({ ok: true, processed });
  } catch (e) {
    console.error("[cron/axisrooms-retry]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
