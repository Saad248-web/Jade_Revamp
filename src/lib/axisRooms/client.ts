/** Axis Rooms channel manager client — live HTTP when credentials + endpoint spec arrive. */

import { auditLog } from "@/lib/audit/auditLog";
import type { AxisRoomsPushResult } from "./types";

type AxisRoomsBooking = {
  _id: unknown;
  checkIn?: string;
  checkOut?: string;
};

function getApiKey(): string | null {
  return process.env.AXIS_ROOMS_API_KEY?.trim() || null;
}

function getBaseUrl(): string {
  return (
    process.env.AXIS_ROOMS_API_BASE_URL?.trim() ||
    "https://api.axisrooms.com"
  );
}

/**
 * Push a confirmed reservation to Axis Rooms.
 * Returns ok:false until certified endpoint is wired; never throws on stub.
 */
export async function pushAxisRoomsReservation(
  booking: AxisRoomsBooking,
): Promise<AxisRoomsPushResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, error: "AXIS_ROOMS_API_KEY not configured" };
  }

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl.replace(/\/$/, "")}/reservations`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        externalBookingId: String(booking._id),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      await auditLog({
        action: "axisrooms.push",
        targetType: "booking",
        targetId: String(booking._id),
        metadata: { ok: false, status: res.status, body: text.slice(0, 500) },
      });
      return {
        ok: false,
        error: `Axis Rooms push failed (${res.status})`,
      };
    }

    let data: { reservationId?: string; id?: string } = {};
    try {
      data = (await res.json()) as typeof data;
    } catch {
      /* empty body ok */
    }

    const reservationId = data.reservationId ?? data.id;
    await auditLog({
      action: "axisrooms.push",
      targetType: "booking",
      targetId: String(booking._id),
      metadata: { ok: true, reservationId },
    });

    return { ok: true, reservationId };
  } catch {
    // Endpoint not live yet — audit stub, do not mark synced
    await auditLog({
      action: "axisrooms.push",
      targetType: "booking",
      targetId: String(booking._id),
      metadata: { stub: true, endpoint },
    });
    return {
      ok: false,
      error: "Axis Rooms endpoint unreachable — awaiting certified API",
      stub: true,
    };
  }
}

export async function pushAxisRoomsCancellation(
  booking: AxisRoomsBooking,
): Promise<AxisRoomsPushResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, error: "AXIS_ROOMS_API_KEY not configured" };
  }

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl.replace(/\/$/, "")}/reservations/${String(booking._id)}/cancel`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ externalBookingId: String(booking._id) }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      await auditLog({
        action: "axisrooms.cancel",
        targetType: "booking",
        targetId: String(booking._id),
        metadata: { ok: false, status: res.status, body: text.slice(0, 500) },
      });
      return { ok: false, error: `Axis Rooms cancel failed (${res.status})` };
    }

    await auditLog({
      action: "axisrooms.cancel",
      targetType: "booking",
      targetId: String(booking._id),
      metadata: { ok: true },
    });
    return { ok: true };
  } catch {
    await auditLog({
      action: "axisrooms.cancel",
      targetType: "booking",
      targetId: String(booking._id),
      metadata: { stub: true, endpoint },
    });
    return {
      ok: false,
      error: "Axis Rooms cancel endpoint unreachable",
      stub: true,
    };
  }
}
