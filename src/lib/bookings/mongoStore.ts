import { auditLog } from "@/lib/audit/auditLog";
import { rangesOverlap } from "@/lib/bookingDates";
import {
  acquireNightLocks,
  releaseNightLocks,
  withTransaction,
} from "@/lib/bookings/nightLocks";
import { lockDatesForBooking } from "@/lib/bookings/pricing";
import type {
  BookingRecord,
  BookingStore,
  CreateBookingParams,
} from "@/lib/bookings/store";
import type { StayStatus } from "@/lib/bookings/types";
import { connectDB } from "@/lib/db";
import { queueBookingInventorySync } from "@/lib/axisRooms/sync";
import { notifyBookingCreated } from "@/lib/email/bookingNotifications";
import { BookingModel } from "@/models/Booking";
import { VillaBlockModel } from "@/models/VillaBlock";
import { VillaModel } from "@/models/Villa";
import { WebhookEventModel } from "@/models/WebhookEvent";
import type { Types } from "mongoose";

function toRecord(doc: {
  _id: Types.ObjectId;
  bookingToken: string;
  villaId: Types.ObjectId;
  bookingType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestDetails?: { name?: string; email?: string; phone?: string };
  pricing?: CreateBookingParams["pricing"];
  payment?: CreateBookingParams["payment"];
  status: string;
  source?: string;
  notes?: string;
  stayStatus?: string;
  axisRoomsSynced?: boolean;
  axisRoomsCancelSynced?: boolean;
  axisRoomsLastError?: string;
  axisRoomsReservationId?: string;
  addOns?: CreateBookingParams["addOns"];
  expiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}): BookingRecord {
  return {
    id: String(doc._id),
    bookingToken: doc.bookingToken,
    villaId: String(doc.villaId),
    bookingType: doc.bookingType as BookingRecord["bookingType"],
    checkIn: doc.checkIn,
    checkOut: doc.checkOut,
    guests: doc.guests,
    guestDetails: {
      name: doc.guestDetails?.name ?? "",
      email: doc.guestDetails?.email ?? "",
      phone: doc.guestDetails?.phone ?? "",
    },
    pricing: doc.pricing as BookingRecord["pricing"],
    payment: doc.payment as BookingRecord["payment"],
    status: doc.status as BookingRecord["status"],
    source: doc.source,
    notes: doc.notes,
    stayStatus: doc.stayStatus as StayStatus | undefined,
    axisRoomsSynced: doc.axisRoomsSynced,
    axisRoomsCancelSynced: doc.axisRoomsCancelSynced,
    axisRoomsLastError: doc.axisRoomsLastError,
    axisRoomsReservationId: doc.axisRoomsReservationId,
    addOns: doc.addOns,
    expiresAt: doc.expiresAt,
    createdAt: doc.createdAt ?? new Date(),
    updatedAt: doc.updatedAt ?? new Date(),
  };
}

async function activeBookingFilter(now: Date) {
  return {
    isDeleted: false,
    $or: [
      { status: "confirmed" },
      { status: "on_hold" },
      { status: "conflict" },
      {
        status: "pending",
        expiresAt: { $gt: now },
      },
    ],
  };
}

export class MongoBookingStore implements BookingStore {
  async createPending(params: CreateBookingParams): Promise<BookingRecord> {
    await connectDB();
    const villaOid = params.villaId as unknown as Types.ObjectId;
    const lockDates = lockDatesForBooking({
      bookingType: params.bookingType,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      eventStartDate: params.eventStartDate,
      eventEndDate: params.eventEndDate,
    });

    return withTransaction(async (session) => {
      const now = new Date();
      const overlapBookings = await BookingModel.find({
        villaId: villaOid,
        ...(await activeBookingFilter(now)),
      }).session(session);

      for (const b of overlapBookings) {
        if (
          rangesOverlap(params.checkIn, params.checkOut, b.checkIn, b.checkOut)
        ) {
          throw new Error("DATE_CONFLICT");
        }
      }

      const blocks = await VillaBlockModel.find({
        villaId: villaOid,
        isDeleted: false,
      }).session(session);
      for (const bl of blocks) {
        if (
          rangesOverlap(params.checkIn, params.checkOut, bl.checkIn, bl.checkOut)
        ) {
          throw new Error("BLOCK_CONFLICT");
        }
      }

      const [doc] = await BookingModel.create(
        [
          {
            villaId: villaOid,
            bookingType: params.bookingType,
            guestDetails: params.guestDetails,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            guests: params.guests,
            adults: params.adults,
            children: params.children,
            pets: params.pets,
            notes: params.notes,
            addOns: params.addOns,
            eventTierId: params.eventTierId,
            eventGuests: params.eventGuests,
            eventStartDate: params.eventStartDate,
            eventEndDate: params.eventEndDate,
            pricing: params.pricing,
            payment: params.payment,
            bookingToken: params.bookingToken,
            status: "pending",
            expiresAt: params.expiresAt,
            stayStatus: "upcoming",
            source: "website",
          },
        ],
        { session },
      );

      const lock = await acquireNightLocks({
        villaId: villaOid,
        bookingId: doc._id,
        dates: lockDates,
        session,
      });
      if (!lock.ok) throw new Error("LOCK_CONFLICT");

      await auditLog({
        action: "booking.create",
        targetType: "booking",
        targetId: String(doc._id),
        ip: params.ip,
        metadata: { villaSlug: params.villaSlug, status: "pending" },
      });

      return toRecord(doc);
    });
  }

  async findById(id: string): Promise<BookingRecord | null> {
    await connectDB();
    const doc = await BookingModel.findOne({ _id: id, isDeleted: false });
    return doc ? toRecord(doc) : null;
  }

  async findByToken(token: string): Promise<BookingRecord | null> {
    await connectDB();
    const doc = await BookingModel.findOne({ bookingToken: token, isDeleted: false });
    return doc ? toRecord(doc) : null;
  }

  async findByOrderId(orderId: string): Promise<BookingRecord | null> {
    await connectDB();
    const doc = await BookingModel.findOne({
      "payment.orderId": orderId,
      isDeleted: false,
    });
    return doc ? toRecord(doc) : null;
  }

  async listActive(filters?: { villaId?: string }): Promise<BookingRecord[]> {
    await connectDB();
    const now = new Date();
    const q: Record<string, unknown> = {
      isDeleted: false,
      status: { $nin: ["cancelled", "expired"] },
    };
    if (filters?.villaId) q.villaId = filters.villaId;
    const docs = await BookingModel.find(q).sort({ createdAt: -1 }).limit(500);
    return docs
      .filter((d) => {
        if (d.status === "pending" && d.expiresAt && d.expiresAt <= now)
          return false;
        return true;
      })
      .map(toRecord);
  }

  async confirmPayment(params: {
    bookingId: string;
    orderId: string;
    paymentId: string;
    eventId: string;
  }): Promise<{ ok: boolean; alreadyConfirmed?: boolean }> {
    await connectDB();

    try {
      await WebhookEventModel.create({
        eventId: params.eventId,
        source: "razorpay",
        status: "processed",
      });
    } catch (e: unknown) {
      const err = e as { code?: number };
      if (err.code === 11000) {
        return { ok: true, alreadyConfirmed: true };
      }
      throw e;
    }

    return withTransaction(async (session) => {
      const existingBefore = await BookingModel.findById(params.bookingId).session(
        session,
      );
      if (!existingBefore || existingBefore.status === "confirmed") {
        return { ok: true, alreadyConfirmed: true };
      }

      const depositPaid =
        existingBefore.payment?.depositPaise ??
        existingBefore.pricing?.totalPaise ??
        0;

      const doc = await BookingModel.findOneAndUpdate(
        {
          _id: params.bookingId,
          status: { $ne: "confirmed" },
          "payment.orderId": params.orderId,
        },
        {
          $set: {
            status: "confirmed",
            "payment.status":
              existingBefore.payment?.paymentPlan === "deposit"
                ? "deposit_paid"
                : "paid",
            "payment.paymentId": params.paymentId,
            "payment.processedPaymentId": params.paymentId,
            "payment.depositPaidPaise": depositPaid,
            expiresAt: null,
            axisRoomsSynced: false,
          },
        },
        { new: true, session },
      );

      if (!doc) {
        return { ok: false };
      }

      await auditLog({
        action: "booking.update",
        targetType: "booking",
        targetId: params.bookingId,
        metadata: { status: "confirmed", paymentId: params.paymentId },
      });

      const villa = await VillaModel.findById(doc.villaId)
        .select("name")
        .session(session)
        .lean();
      const guest = doc.guestDetails ?? {};
      void notifyBookingCreated({
        bookingId: params.bookingId,
        villaName: villa?.name ?? "Villa",
        checkIn: doc.checkIn,
        checkOut: doc.checkOut,
        guestName: guest.name ?? "Guest",
        guestEmail: guest.email ?? "",
        guestPhone: guest.phone ?? "",
        totalPrice: Math.round((doc.pricing?.totalPaise ?? 0) / 100),
      });

      void queueBookingInventorySync(params.bookingId, "close");

      return { ok: true };
    });
  }

  async expirePending(now: Date): Promise<number> {
    await connectDB();
    const pending = await BookingModel.find({
      status: "pending",
      expiresAt: { $lt: now },
    });
    let count = 0;
    for (const doc of pending) {
      doc.status = "expired";
      if (doc.payment) doc.payment.status = "failed";
      await doc.save();
      await releaseNightLocks(doc._id);
      await auditLog({
        action: "booking.expire",
        targetType: "booking",
        targetId: String(doc._id),
      });
      count++;
    }
    return count;
  }

  async updateStayStatus(
    id: string,
    stayStatus: StayStatus,
  ): Promise<BookingRecord | null> {
    await connectDB();
    const doc = await BookingModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { stayStatus } },
      { new: true },
    );
    return doc ? toRecord(doc) : null;
  }

  async cancelBooking(
    id: string,
    userId?: string,
    options?: { reason?: string },
  ): Promise<BookingRecord | null> {
    await connectDB();
    const doc = await BookingModel.findOne({ _id: id, isDeleted: false });
    if (!doc || doc.status === "cancelled") return null;

    const previousStatus = doc.status;
    doc.status = "cancelled";
    doc.axisRoomsCancelSynced = false;
    await doc.save();
    await releaseNightLocks(doc._id);

    await auditLog({
      action: "booking.cancel",
      targetType: "booking",
      targetId: id,
      userId,
      metadata: {
        previousStatus,
        reason: options?.reason,
        cancelledBy: userId ? "staff" : "system",
        source: doc.source,
        checkIn: doc.checkIn,
        checkOut: doc.checkOut,
      },
    });

    return toRecord(doc);
  }

  async confirmHold(
    id: string,
    userId?: string,
    waivePayment = false,
  ): Promise<BookingRecord | null> {
    await connectDB();
    const doc = await BookingModel.findOne({
      _id: id,
      isDeleted: false,
      status: "on_hold",
    });
    if (!doc) return null;

    doc.status = "confirmed";
    if (doc.payment) {
      doc.payment.status = waivePayment ? "not_applicable" : "external";
    }
    await doc.save();

    await auditLog({
      action: "booking.confirm_hold",
      targetType: "booking",
      targetId: id,
      userId,
      metadata: {
        waivePayment,
        previousStatus: "on_hold",
        newStatus: "confirmed",
      },
    });

    return toRecord(doc);
  }

  async updateNotes(
    id: string,
    notes: string,
  ): Promise<BookingRecord | null> {
    await connectDB();
    const doc = await BookingModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { notes } },
      { new: true },
    );
    return doc ? toRecord(doc) : null;
  }

  async createManual(
    params: CreateBookingParams & { source?: string; status?: import("./types").BookingStatus },
  ): Promise<BookingRecord> {
    await connectDB();
    const villaOid = params.villaId as unknown as Types.ObjectId;
    const lockDates = lockDatesForBooking({
      bookingType: params.bookingType,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      eventStartDate: params.eventStartDate,
      eventEndDate: params.eventEndDate,
    });

    return withTransaction(async (session) => {
      const now = new Date();
      const overlapBookings = await BookingModel.find({
        villaId: villaOid,
        ...(await activeBookingFilter(now)),
      }).session(session);

      for (const b of overlapBookings) {
        if (
          rangesOverlap(params.checkIn, params.checkOut, b.checkIn, b.checkOut)
        ) {
          throw new Error("DATE_CONFLICT");
        }
      }

      const blocks = await VillaBlockModel.find({
        villaId: villaOid,
        isDeleted: false,
      }).session(session);
      for (const bl of blocks) {
        if (
          rangesOverlap(params.checkIn, params.checkOut, bl.checkIn, bl.checkOut)
        ) {
          throw new Error("BLOCK_CONFLICT");
        }
      }

      const status = params.status ?? "confirmed";
      const [doc] = await BookingModel.create(
        [
          {
            villaId: villaOid,
            bookingType: params.bookingType,
            guestDetails: params.guestDetails,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            guests: params.guests,
            adults: params.adults,
            children: params.children,
            pets: params.pets,
            notes: params.notes,
            addOns: params.addOns,
            pricing: params.pricing,
            payment: params.payment,
            bookingToken: params.bookingToken,
            status,
            expiresAt: status === "pending" ? params.expiresAt : null,
            stayStatus: "upcoming",
            source: params.source ?? "admin_manual",
            axisRoomsSynced: false,
          },
        ],
        { session },
      );

      const lock = await acquireNightLocks({
        villaId: villaOid,
        bookingId: doc._id,
        dates: lockDates,
        session,
      });
      if (!lock.ok) throw new Error("LOCK_CONFLICT");

      await auditLog({
        action: "booking.create",
        targetType: "booking",
        targetId: String(doc._id),
        userId: params.ip,
        metadata: { villaSlug: params.villaSlug, status, source: "admin_manual", onHold: status === "on_hold" },
      });

      return toRecord(doc);
    });
  }

  async softDelete(id: string, userId?: string): Promise<boolean> {
    await connectDB();
    const doc = await BookingModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
          status: "cancelled",
        },
      },
    );
    if (doc) {
      await releaseNightLocks(doc._id);
      await auditLog({
        action: "booking.cancel",
        targetType: "booking",
        targetId: id,
        userId,
      });
    }
    return Boolean(doc);
  }

  async getAvailability(
    villaId: string,
    from: string,
    to: string,
  ): Promise<{ bookedDates: string[]; blockedDates: string[] }> {
    await connectDB();
    const now = new Date();
    const bookings = await BookingModel.find({
      villaId,
      ...(await activeBookingFilter(now)),
      checkIn: { $lt: to },
      checkOut: { $gt: from },
    });
    const blocks = await VillaBlockModel.find({
      villaId,
      isDeleted: false,
      checkIn: { $lt: to },
      checkOut: { $gt: from },
    });

    const bookedDates = new Set<string>();
    for (const b of bookings) {
      let cur = b.checkIn;
      while (cur < b.checkOut && cur < to) {
        if (cur >= from) bookedDates.add(cur);
        const next = new Date(`${cur}T00:00:00.000Z`);
        next.setUTCDate(next.getUTCDate() + 1);
        cur = next.toISOString().slice(0, 10);
      }
    }

    const blockedDates = new Set<string>();
    for (const bl of blocks) {
      let cur = bl.checkIn;
      while (cur < bl.checkOut && cur < to) {
        if (cur >= from) blockedDates.add(cur);
        const next = new Date(`${cur}T00:00:00.000Z`);
        next.setUTCDate(next.getUTCDate() + 1);
        cur = next.toISOString().slice(0, 10);
      }
    }

    return {
      bookedDates: Array.from(bookedDates),
      blockedDates: Array.from(blockedDates),
    };
  }
}

let storeInstance: MongoBookingStore | null = null;

export function getBookingStore(): MongoBookingStore {
  if (!storeInstance) storeInstance = new MongoBookingStore();
  return storeInstance;
}

/** Stub seed data when Mongo unavailable — degraded read only */
export function getStubVillaBySlug(slug: string) {
  const STUB_VILLAS: Record<string, ReturnType<typeof stubVilla>> = {
    magnolia: stubVilla("magnolia", "Magnolia by Jade", 5400000, 12, 24, 40),
    tranquil: stubVilla("tranquil", "Tranquil Woods", 6600000, 15, 30, 30),
    emerald: stubVilla("emerald", "Emerald by Jade", 3200000, 6, 16, 8),
  };
  return STUB_VILLAS[slug];
}

function stubVilla(
  slug: string,
  name: string,
  basePricePaise: number,
  stayBasePax: number,
  dayOutBasePax: number,
  stayMaxPax: number,
) {
  return {
    slug,
    name,
    basePricePaise,
    dayOutBasePricePaise: basePricePaise,
    stayBasePax,
    dayOutBasePax,
    stayMaxPax,
    extraPaxStayPaise: 200000,
    extraPaxDayOutPaise: 100000,
    weddingVenue: slug === "magnolia",
    weddingTiers:
      slug === "magnolia"
        ? [
            {
              id: "wedding-full",
              label: "Wedding full-day",
              mode: "full_day" as const,
              maxGuests: 300,
              pricePaise: 20000000,
              stayIncludedPax: 20,
            },
          ]
        : [],
    settings: {
      taxPercent: 18,
      cleaningFeePaise: 0,
      securityDepositPaise: 0,
      cancellationPolicy: "[TO BE CONFIRMED]",
    },
    bookable: true,
  };
}

export async function findVillaBySlug(slug: string) {
  try {
    await connectDB();
    return VillaModel.findOne({ slug, isDeleted: false, bookable: true });
  } catch {
    return getStubVillaBySlug(slug);
  }
}
