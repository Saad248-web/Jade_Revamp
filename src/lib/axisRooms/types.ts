export type AxisRoomsMapping = {
  propertyId?: string;
  roomTypeId?: string;
  ratePlanId?: string;
  ratePlanName?: string;
};

export type AxisRoomsPushResult = {
  ok: boolean;
  reservationId?: string;
  error?: string;
  stub?: boolean;
  details?: {
    api2?: { ok: boolean; message?: string };
    api1?: { ok: boolean; message?: string };
    startDate?: string;
    endDate?: string;
    availability?: number;
    /** Occupied nights pushed (check-out exclusive) */
    nights?: string[];
  };
};

export type AxisRoomsInboundEvent = {
  eventType: "create" | "modify" | "cancel" | "unknown";
  bookingNo?: string;
  bookingStatus?: "confirmed" | "modified" | "cancelled" | "unknown";
  reservationId?: string;
  propertyId?: string;
  roomTypeId?: string;
  ratePlanId?: string;
  noOfRooms?: number;
  otaRefId?: string;
  checkIn?: string;
  checkOut?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  channel?: "airbnb" | "booking_com" | "other";
  totalPax?: number;
  children?: number;
  totalAmountPaise?: number;
  taxPaise?: number;
  accessKey?: string;
  raw: Record<string, unknown>;
};
