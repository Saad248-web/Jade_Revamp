import type { AxisRoomsInboundEvent } from "./types";

/** Parse Axis Rooms inbound webhook payload — extend when vendor spec arrives. */
export function parseAxisRoomsInbound(
  payload: unknown,
): AxisRoomsInboundEvent | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }
  const p = payload as Record<string, unknown>;

  const eventRaw =
    typeof p.event === "string"
      ? p.event
      : typeof p.eventType === "string"
        ? p.eventType
        : "";

  let eventType: AxisRoomsInboundEvent["eventType"] = "unknown";
  const lower = eventRaw.toLowerCase();
  if (lower.includes("cancel")) eventType = "cancel";
  else if (lower.includes("modify") || lower.includes("update"))
    eventType = "modify";
  else if (lower.includes("create") || lower.includes("book"))
    eventType = "create";

  const channelRaw =
    typeof p.channel === "string"
      ? p.channel
      : typeof p.source === "string"
        ? p.source
        : "";
  let channel: AxisRoomsInboundEvent["channel"] = "other";
  if (/airbnb/i.test(channelRaw)) channel = "airbnb";
  else if (/booking/i.test(channelRaw)) channel = "booking_com";

  return {
    eventType,
    reservationId:
      typeof p.reservationId === "string"
        ? p.reservationId
        : typeof p.id === "string"
          ? p.id
          : undefined,
    propertyId:
      typeof p.propertyId === "string" ? p.propertyId : undefined,
    roomTypeId:
      typeof p.roomTypeId === "string" ? p.roomTypeId : undefined,
    checkIn:
      typeof p.checkIn === "string"
        ? p.checkIn.split("T")[0]
        : typeof p.check_in === "string"
          ? p.check_in.split("T")[0]
          : undefined,
    checkOut:
      typeof p.checkOut === "string"
        ? p.checkOut.split("T")[0]
        : typeof p.check_out === "string"
          ? p.check_out.split("T")[0]
          : undefined,
    guestName:
      typeof p.guestName === "string"
        ? p.guestName
        : typeof p.guest_name === "string"
          ? p.guest_name
          : undefined,
    guestEmail:
      typeof p.guestEmail === "string"
        ? p.guestEmail
        : typeof p.guest_email === "string"
          ? p.guest_email
          : undefined,
    guestPhone:
      typeof p.guestPhone === "string"
        ? p.guestPhone
        : typeof p.guest_phone === "string"
          ? p.guest_phone
          : undefined,
    channel,
    raw: p,
  };
}
