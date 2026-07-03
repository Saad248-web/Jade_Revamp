import { connectDB } from "@/lib/db";
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
import type { Types } from "mongoose";

export type InboundUpsertResult = {
  ok: boolean;
  bookingId?: string;
  conflict?: boolean;
  duplicate?: boolean;
  error?: string;
};

function sourceFromChannel(
  channel: AxisRoomsInboundEvent["channel"],
): "axisrooms_airbnb" | "axisrooms_booking_com" {
  if (channel === "airbnb") return "axisrooms_airbnb";
  return "axisrooms_booking_com";
}

export async function upsertAxisRoomsInbound(
  parsed: AxisRoomsInboundEvent,
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

  try {
    await WebhookEventModel.create({
      eventId,
      source: "axisrooms",
      status: "processed",
    });
  } catch (e: unknown) {
    if ((e as { code?: number }).code === 11000) {
      return { ok: true, duplicate: true };
    }
    throw e;
  }

  const villa = await VillaModel.findOne({
    "axisRooms.propertyId": parsed.propertyId,
    isDeleted: false,
  });
  if (!villa) {
    return { ok: false, error: `Unknown hotelId: ${parsed.propertyId}` };
  }

  if (parsed.eventType === "cancel" || parsed.bookingStatus === "cancelled") {
    const existing = await BookingModel.findOne({
      axisRoomsReservationId: bookingNo,
      isDeleted: false,
    });
    if (!existing) {
      return { ok: true };
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
    return { ok: true, bookingId: String(existing._id) };
  }

  const existing = await BookingModel.findOne({
    axisRoomsReservationId: bookingNo,
    isDeleted: false,
  });

  if (existing && parsed.eventType === "modify") {
    existing.checkIn = parsed.checkIn;
    existing.checkOut = parsed.checkOut;
    existing.guestDetails = {
      name: parsed.guestName ?? existing.guestDetails?.name ?? "",
      email: parsed.guestEmail ?? existing.guestDetails?.email ?? "",
      phone: parsed.guestPhone ?? existing.guestDetails?.phone ?? "",
    };
    await existing.save();
    await auditLog({
      action: "booking.update",
      targetType: "booking",
      targetId: String(existing._id),
      metadata: {
        source: "axisrooms_inbound",
        eventType: "modify",
        bookingNo,
        checkIn: parsed.checkIn,
        checkOut: parsed.checkOut,
      },
    });
    return { ok: true, bookingId: String(existing._id) };
  }

  if (existing) {
    return { ok: true, bookingId: String(existing._id), duplicate: true };
  }

  const lockDates = lockDatesForBooking({
    bookingType: "stay",
    checkIn: parsed.checkIn,
    checkOut: parsed.checkOut,
  });

  try {
    return await withTransaction(async (session) => {
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
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Inbound upsert failed",
    };
  }
}
