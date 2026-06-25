export type AxisRoomsMapping = {
  propertyId?: string;
  roomTypeId?: string;
  ratePlanId?: string;
};

export type AxisRoomsPushResult = {
  ok: boolean;
  reservationId?: string;
  error?: string;
  stub?: boolean;
};

export type AxisRoomsInboundEvent = {
  eventType: "create" | "modify" | "cancel" | "unknown";
  reservationId?: string;
  propertyId?: string;
  roomTypeId?: string;
  checkIn?: string;
  checkOut?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  channel?: "airbnb" | "booking_com" | "other";
  raw: Record<string, unknown>;
};
