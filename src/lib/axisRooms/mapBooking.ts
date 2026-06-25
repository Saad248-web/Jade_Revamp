import type { AxisRoomsMapping } from "./types";

export function villaAxisRoomsMapping(
  villa: { axisRooms?: AxisRoomsMapping | null },
): AxisRoomsMapping {
  const m = villa.axisRooms ?? {};
  return {
    propertyId: m.propertyId?.trim() || undefined,
    roomTypeId: m.roomTypeId?.trim() || undefined,
    ratePlanId: m.ratePlanId?.trim() || undefined,
  };
}

export function isAxisRoomsMapped(villa: {
  axisRooms?: AxisRoomsMapping | null;
}): boolean {
  const m = villaAxisRoomsMapping(villa);
  return Boolean(m.propertyId && m.roomTypeId);
}
