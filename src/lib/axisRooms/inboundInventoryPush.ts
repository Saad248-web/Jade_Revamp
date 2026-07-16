import { expandNightDates } from "@/lib/bookingDates";
import {
  pushBulkInventoryForRange,
  pushInventoryForRange,
} from "./inventory";
import type { AxisRoomsPushResult } from "./types";

export type StayInventoryPushParams = {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  /** Used as audit / correlation id */
  bookingNo: string;
  bookingId?: string;
  /** close = booked (0), open = free (1) */
  mode: "close" | "open";
  /** Optional audit type for staff vs OTA */
  auditTargetType?: string;
};

/** Last occupied night (check-out exclusive). */
export function stayEndDate(checkIn: string, checkOut: string): string {
  const nights = expandNightDates(checkIn, checkOut);
  if (nights.length === 0) return checkIn;
  return nights[nights.length - 1]!;
}

/**
 * Canonical inventory push after any validated booking save
 * (API 9 OTA, website, or staff). Always:
 * 1) API 2 bulk `/api/inventory` — one date-range request per stay
 *    (startDate = check-in, endDate = last occupied night, inclusive)
 * 2) API 1 daywise `/api/daywiseInventory` — all nights in one request
 */
export async function pushStayInventoryToAxis(
  params: StayInventoryPushParams,
): Promise<AxisRoomsPushResult> {
  const nights = expandNightDates(params.checkIn, params.checkOut);
  if (nights.length === 0) {
    return { ok: true };
  }

  const endDate = nights[nights.length - 1]!;
  const availability = params.mode === "close" ? 0 : 1;
  const free: 0 | 1 = availability === 0 ? 0 : 1;
  const auditTargetId = params.bookingId ?? params.bookingNo;
  const auditTargetType = params.auditTargetType ?? "axisrooms_inbound";

  console.info("[axisrooms.inventory] outbound start", {
    mode: params.mode,
    hotelId: params.hotelId,
    roomId: params.roomId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    startDate: params.checkIn,
    endDate,
    nights,
    nightCount: nights.length,
    bookingNo: params.bookingNo,
    bookingId: params.bookingId,
  });

  const bulk = await pushBulkInventoryForRange({
    hotelId: params.hotelId,
    roomId: params.roomId,
    startDate: params.checkIn,
    endDate,
    availability,
    auditTargetId,
    auditTargetType,
  });

  console.info("[axisrooms.inventory] API2 bulk result", {
    ok: bulk.ok,
    error: bulk.error,
    hotelId: params.hotelId,
    startDate: params.checkIn,
    endDate,
    availability,
    nightCount: nights.length,
  });

  if (!bulk.ok) {
    return {
      ok: false,
      error: bulk.error ?? "API 2 inventory push failed",
      details: {
        api2: { ok: false, message: bulk.error },
        startDate: params.checkIn,
        endDate,
        availability,
        nights,
      },
    };
  }

  const daywise = await pushInventoryForRange({
    hotelId: params.hotelId,
    roomId: params.roomId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    free,
    auditTargetId,
    auditTargetType,
  });

  console.info("[axisrooms.inventory] API1 daywise result", {
    ok: daywise.ok,
    error: daywise.error,
    hotelId: params.hotelId,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    nights,
    nightCount: nights.length,
    free,
  });

  if (!daywise.ok) {
    return {
      ok: false,
      error: daywise.error ?? "API 1 daywise inventory push failed",
      details: {
        api2: { ok: true },
        api1: { ok: false, message: daywise.error },
        startDate: params.checkIn,
        endDate,
        availability,
        nights,
      },
    };
  }

  return {
    ok: true,
    details: {
      api2: { ok: true },
      api1: { ok: true },
      startDate: params.checkIn,
      endDate,
      availability,
      nights,
    },
  };
}

/** @deprecated Prefer pushStayInventoryToAxis — kept for inbound call sites. */
export async function pushInboundInventoryAck(
  params: StayInventoryPushParams,
): Promise<AxisRoomsPushResult> {
  return pushStayInventoryToAxis(params);
}

/** Modify: open old stay range, then close new stay range (API 2 + API 1 each). */
export async function pushInboundInventoryModify(params: {
  hotelId: string;
  roomId: string;
  bookingNo: string;
  bookingId?: string;
  oldCheckIn: string;
  oldCheckOut: string;
  newCheckIn: string;
  newCheckOut: string;
  auditTargetType?: string;
}): Promise<AxisRoomsPushResult> {
  if (
    params.oldCheckIn === params.newCheckIn &&
    params.oldCheckOut === params.newCheckOut
  ) {
    return { ok: true };
  }

  const openResult = await pushStayInventoryToAxis({
    hotelId: params.hotelId,
    roomId: params.roomId,
    checkIn: params.oldCheckIn,
    checkOut: params.oldCheckOut,
    bookingNo: params.bookingNo,
    bookingId: params.bookingId,
    mode: "open",
    auditTargetType: params.auditTargetType,
  });
  if (!openResult.ok) return openResult;

  return pushStayInventoryToAxis({
    hotelId: params.hotelId,
    roomId: params.roomId,
    checkIn: params.newCheckIn,
    checkOut: params.newCheckOut,
    bookingNo: params.bookingNo,
    bookingId: params.bookingId,
    mode: "close",
    auditTargetType: params.auditTargetType,
  });
}

export function inboundDatesFromPayload(
  checkIn: string,
  checkOut: string,
): { startDate: string; endDate: string } {
  return { startDate: checkIn, endDate: stayEndDate(checkIn, checkOut) };
}

export function hasStayNights(checkIn: string, checkOut: string): boolean {
  return expandNightDates(checkIn, checkOut).length > 0;
}

export function formatApi2Range(checkIn: string, checkOut: string): string {
  const nights = expandNightDates(checkIn, checkOut);
  if (nights.length === 0) return checkIn;
  if (nights.length === 1) return nights[0]!;
  return `${nights[0]} → ${nights[nights.length - 1]} (${nights.length} nights)`;
}

export { addDays } from "@/lib/bookingDates";
