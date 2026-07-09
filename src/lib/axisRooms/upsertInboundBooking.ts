import { connectDB } from "@/lib/db";
import { rangesOverlap } from "@/lib/bookingDates";
import {
  acquireNightLocks,
  releaseNightLocks,
  withTransaction,
} from "@/lib/bookings/nightLocks";
import { lockDatesForBooking } from "@/lib/bookings/pricing";
import { BookingModel } from "@/models/Booking";
import { VillaModel } from "@/models/Villa";
import { WebhookEventModel } from "@/models/WebhookEvent";
import { auditLog } from "@/lib/audit/auditLog";
import { notifyBookingConflict, notifyBookingConfirmed } from "@/lib/email/bookingNotifications";
import type { AxisRoomsInboundEvent } from "./types";
import type { InboundValidationSuccess } from "./validateInbound";
import type { AxisRoomsPushResult } from "./types";
import {
  pushInboundInventoryAck,
  pushInboundInventoryModify,
  hasStayNights,
} from "./inboundInventoryPush";
import type { Types } from "mongoose";

export type InboundUpsertResult = {
  ok: boolean;
  bookingId?: string;
  conflict?: boolean;
  duplicate?: boolean;
  error?: string;
  axisInventorySync?: AxisRoomsPushResult;
};

function sourceFromChannel(
  channel: AxisRoomsInboundEvent["channel"],
): "axisrooms_airbnb" | "axisrooms_booking_com" {
  if (channel === "airbnb") return "axisrooms_airbnb";
  return "axisrooms_booking_com";
}

function axisIdsFromInbound(
  parsed: AxisRoomsInboundEvent,
  validated?: InboundValidationSuccess,
): { hotelId: string; roomId: string } | null {
  const hotelId =
    validated?.mapping.propertyId ?? parsed.propertyId?.trim();
  const roomId = validated?.mapping.roomTypeId ?? parsed.roomTypeId?.trim();
  if (!hotelId || !roomId) return null;
  return { hotelId, roomId };
}

async function ackInboundInventory(params: {
  parsed: AxisRoomsInboundEvent;
  validated?: InboundValidationSuccess;
  bookingNo: string;
  bookingId?: string;
  mode: "close" | "open";
  checkIn: string;
  checkOut: string;
}): Promise<AxisRoomsPushResult | undefined> {
  if (!hasStayNights(params.checkIn, params.checkOut)) return undefined;
  const ids = axisIdsFromInbound(params.parsed, params.validated);
  if (!ids) return { ok: false, error: "Missing hotelId/roomId for API 2" };

  return pushInboundInventoryAck({
    hotelId: ids.hotelId,
    roomId: ids.roomId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    bookingNo: params.bookingNo,
    bookingId: params.bookingId,
    mode: params.mode,
  });
}

export async function upsertAxisRoomsInbound(
  parsed: AxisRoomsInboundEvent,
  validated?: InboundValidationSuccess,
): Promise<InboundUpsertResult> {
  if (!parsed.bookingNo && !parsed.reservationId) {
    return { ok: false, error: "Missing bookingNo" };
  }
  if (!parsed.propertyId || !parsed.checkIn || !parsed.checkOut) {
    return { ok: false, error: "Missing hotelId or dates" };
  }

  const bookingNo = parsed.bookingNo ?? parsed.reservationId!;
  const eventId = `${bookingNo}:${parsed.bookingStatus ?? parsed.eventType}`;

  await connectDB();

  const existingEvent = await WebhookEventModel.findOne({
    eventId,
    source: "axisrooms",
  }).lean();
  if (existingEvent?.status === "processed") {
    return { ok: true, duplicate: true };
  }
  await WebhookEventModel.updateOne(
    { eventId, source: "axisrooms" },
    {
      $setOnInsert: {
        payload: parsed.raw,
      },
      $set: {
        bookingId: bookingNo,
        status: "received",
        error: undefined,
      },
    },
    { upsert: true },
  );

  const mappingQuery: Record<string, unknown> = {
    isDeleted: false,
    "axisRooms.propertyId": parsed.propertyId,
  };
  if (parsed.roomTypeId) {
    mappingQuery["axisRooms.roomTypeId"] = parsed.roomTypeId;
  }

  let villa;
  if (validated) {
    villa = await VillaModel.findById(validated.villa._id);
    if (!villa) {
      return { ok: false, error: "Validated villa not found" };
    }
  } else {
    const villas = await VillaModel.find(mappingQuery).limit(2);
    if (villas.length !== 1) {
      const error =
        villas.length === 0
          ? `Unknown hotelId: ${parsed.propertyId}`
          : `Ambiguous Axis mapping for property ${parsed.propertyId}`;
      await WebhookEventModel.updateOne(
        { eventId, source: "axisrooms" },
        { $set: { status: "failed", error } },
      );
      return { ok: false, error };
    }
    villa = villas[0];
  }

  if (parsed.eventType === "cancel" || parsed.bookingStatus === "cancelled") {
    const existing = await BookingModel.findOne({
      axisRoomsReservationId: bookingNo,
      isDeleted: false,
    });
    if (!existing) {
      const axisInventorySync = await ackInboundInventory({
        parsed,
        validated,
        bookingNo,
        mode: "open",
        checkIn: parsed.checkIn,
        checkOut: parsed.checkOut,
      });
      await WebhookEventModel.updateOne(
        { eventId, source: "axisrooms" },
        {
          $set: {
            status: "processed",
            error: axisInventorySync?.ok === false ? axisInventorySync.error : undefined,
          },
        },
      );
      return { ok: true, axisInventorySync };
    }
    const previousStatus = existing.status;
    existing.status = "cancelled";
    existing.axisRoomsCancelSynced = true;
    existing.axisRoomsSynced = true;
    await existing.save();
    await releaseNightLocks(existing._id);
    await auditLog({
      action: "booking.cancel",
      targetType: "booking",
      targetId: String(existing._id),
      metadata: {
        source: "axisrooms_inbound",
        bookingNo,
        cancelledBy: "ota",
        previousStatus,
        channel: parsed.channel,
      },
    });
    const axisInventorySync = await ackInboundInventory({
      parsed,
      validated,
      bookingNo,
      bookingId: String(existing._id),
      mode: "open",
      checkIn: existing.checkIn,
      checkOut: existing.checkOut,
    });
    if (axisInventorySync && !axisInventorySync.ok) {
      existing.axisRoomsLastError = axisInventorySync.error;
      await existing.save();
    }
    await WebhookEventModel.updateOne(
      { eventId, source: "axisrooms" },
      {
        $set: {
          status: "processed",
          error: axisInventorySync?.ok === false ? axisInventorySync.error : undefined,
        },
      },
    );
    return { ok: true, bookingId: String(existing._id), axisInventorySync };
  }

  const existing = await BookingModel.findOne({
    axisRoomsReservationId: bookingNo,
    isDeleted: false,
  });

  if (existing && parsed.eventType === "modify") {
    const oldCheckIn = existing.checkIn;
    const oldCheckOut = existing.checkOut;
    const lockDates = lockDatesForBooking({
      bookingType: existing.bookingType ?? "stay",
      checkIn: parsed.checkIn,
      checkOut: parsed.checkOut,
    });

    try {
      await withTransaction(async (session) => {
        const now = new Date();
        const overlaps = await BookingModel.find({
          villaId: villa._id,
          _id: { $ne: existing._id },
          isDeleted: false,
          $or: [
            { status: "confirmed" },
            { status: "on_hold" },
            { status: "conflict" },
            { status: "pending", expiresAt: { $gt: now } },
          ],
          checkIn: { $lt: parsed.checkOut },
          checkOut: { $gt: parsed.checkIn },
        }).session(session);

        for (const b of overlaps) {
          if (
            rangesOverlap(
              parsed.checkIn!,
              parsed.checkOut!,
              b.checkIn,
              b.checkOut,
            )
          ) {
            throw new Error("DATE_CONFLICT");
          }
        }

        await releaseNightLocks(existing._id, session);

        const lock = await acquireNightLocks({
          villaId: villa._id as Types.ObjectId,
          bookingId: existing._id,
          dates: lockDates,
          session,
        });
        if (!lock.ok) throw new Error("LOCK_CONFLICT");

        existing.checkIn = parsed.checkIn;
        existing.checkOut = parsed.checkOut;
        existing.guestDetails = {
          name: parsed.guestName ?? existing.guestDetails?.name ?? "",
          email: parsed.guestEmail ?? existing.guestDetails?.email ?? "",
          phone: parsed.guestPhone ?? existing.guestDetails?.phone ?? "",
        };
        await existing.save({ session });

        await auditLog({
          action: "booking.update",
          targetType: "booking",
          targetId: String(existing._id),
          metadata: {
            source: "axisrooms_inbound",
            eventType: "modify",
            bookingNo,
            oldCheckIn,
            oldCheckOut,
            checkIn: parsed.checkIn,
            checkOut: parsed.checkOut,
          },
        });
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Modify failed";
      await WebhookEventModel.updateOne(
        { eventId, source: "axisrooms" },
        { $set: { status: "failed", error: message } },
      );
      return { ok: false, error: message };
    }

    await WebhookEventModel.updateOne(
      { eventId, source: "axisrooms" },
      { $set: { status: "processed" } },
    );

    let axisInventorySync: AxisRoomsPushResult | undefined;
    const ids = axisIdsFromInbound(parsed, validated);
    if (ids && hasStayNights(parsed.checkIn, parsed.checkOut)) {
      axisInventorySync = await pushInboundInventoryModify({
        hotelId: ids.hotelId,
        roomId: ids.roomId,
        bookingNo,
        bookingId: String(existing._id),
        oldCheckIn,
        oldCheckOut,
        newCheckIn: parsed.checkIn,
        newCheckOut: parsed.checkOut,
      });
      if (!axisInventorySync.ok) {
        existing.axisRoomsLastError = axisInventorySync.error;
        await existing.save();
      }
    }

    return { ok: true, bookingId: String(existing._id), axisInventorySync };
  }

  if (existing) {
    await WebhookEventModel.updateOne(
      { eventId, source: "axisrooms" },
      { $set: { status: "processed" } },
    );
    return { ok: true, bookingId: String(existing._id), duplicate: true };
  }

  const lockDates = lockDatesForBooking({
    bookingType: "stay",
    checkIn: parsed.checkIn,
    checkOut: parsed.checkOut,
  });

  try {
    const result = await withTransaction(async (session) => {
      const now = new Date();
      const overlaps = await BookingModel.find({
        villaId: villa._id,
        isDeleted: false,
        $or: [
          { status: "confirmed" },
          { status: "on_hold" },
          { status: "conflict" },
          { status: "pending", expiresAt: { $gt: now } },
        ],
        checkIn: { $lt: parsed.checkOut },
        checkOut: { $gt: parsed.checkIn },
      }).session(session);

      const hasDirectConflict = overlaps.some(
        (b) =>
          b.source === "website" || b.source === "admin_manual",
      );

      const totalPaise = parsed.totalAmountPaise ?? 0;
      const taxPaise = parsed.taxPaise ?? 0;
      const basePaise = Math.max(0, totalPaise - taxPaise);

      const [doc] = await BookingModel.create(
        [
          {
            villaId: villa._id,
            bookingType: "stay",
            guestDetails: {
              name: parsed.guestName ?? "OTA Guest",
              email: parsed.guestEmail ?? "",
              phone: parsed.guestPhone ?? "",
            },
            checkIn: parsed.checkIn,
            checkOut: parsed.checkOut,
            guests: parsed.totalPax ?? 1,
            adults: parsed.totalPax ?? 1,
            children: parsed.children ?? 0,
            pricing: {
              basePaise,
              extraPaxPaise: 0,
              eventPaise: 0,
              addOnPaise: 0,
              taxPaise,
              totalPaise: totalPaise || basePaise + taxPaise,
            },
            payment: {
              gateway: "external",
              paymentPlan: "full",
              amountDuePaise: totalPaise,
              depositPaise: 0,
              depositPaidPaise: 0,
              balancePaise: 0,
              status: "external",
            },
            bookingToken: `axis_${bookingNo.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40)}_${Date.now().toString(36)}`,
            status: hasDirectConflict ? "conflict" : "confirmed",
            source: sourceFromChannel(parsed.channel),
            axisRoomsReservationId: bookingNo,
            axisRoomsSynced: true,
            axisRoomsCancelSynced: true,
          },
        ],
        { session },
      );

      if (!hasDirectConflict) {
        const lock = await acquireNightLocks({
          villaId: villa._id as Types.ObjectId,
          bookingId: doc._id,
          dates: lockDates,
          session,
        });
        if (!lock.ok) {
          doc.status = "conflict";
          await doc.save({ session });
          return { ok: true, bookingId: String(doc._id), conflict: true };
        }
      }

      await auditLog({
        action: "booking.create",
        targetType: "booking",
        targetId: String(doc._id),
        metadata: {
          source: "axisrooms_inbound",
          bookingNo,
          conflict: hasDirectConflict,
        },
      });

      if (hasDirectConflict || doc.status === "conflict") {
        await notifyBookingConflict({
          bookingId: String(doc._id),
          villaName: villa.name ?? villa.slug ?? "Villa",
          checkIn: parsed.checkIn!,
          checkOut: parsed.checkOut!,
          guestName: parsed.guestName ?? "OTA Guest",
          source: sourceFromChannel(parsed.channel),
          reason: hasDirectConflict
            ? "Overlaps with existing direct/staff booking"
            : "Night lock could not be acquired",
        });
      } else {
        void notifyBookingConfirmed({
          bookingId: String(doc._id),
          villaName: villa.name ?? villa.slug ?? "Villa",
          checkIn: parsed.checkIn!,
          checkOut: parsed.checkOut!,
          guestName: parsed.guestName ?? "OTA Guest",
          guestEmail: parsed.guestEmail ?? "",
          guestPhone: parsed.guestPhone ?? "",
          guests: parsed.totalPax ?? 1,
          totalPaise: totalPaise || basePaise + taxPaise,
          paymentStatus: "external",
          source: sourceFromChannel(parsed.channel),
        });
      }

      return {
        ok: true,
        bookingId: String(doc._id),
        conflict: hasDirectConflict,
      };
    });
    await WebhookEventModel.updateOne(
      { eventId, source: "axisrooms" },
      { $set: { status: "processed", error: undefined } },
    );

    const axisInventorySync = await ackInboundInventory({
      parsed,
      validated,
      bookingNo,
      bookingId: result.bookingId,
      mode: "close",
      checkIn: parsed.checkIn,
      checkOut: parsed.checkOut,
    });

    if (result.bookingId && axisInventorySync && !axisInventorySync.ok) {
      await BookingModel.findByIdAndUpdate(result.bookingId, {
        $set: { axisRoomsLastError: axisInventorySync.error },
        $inc: { axisRoomsSyncAttempts: 1 },
      });
    }

    return { ...result, axisInventorySync };
  } catch (e) {
    await WebhookEventModel.updateOne(
      { eventId, source: "axisrooms" },
      {
        $set: {
          status: "failed",
          error: e instanceof Error ? e.message : "Inbound upsert failed",
        },
      },
    );
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Inbound upsert failed",
    };
  }
}
