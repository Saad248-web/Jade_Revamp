/** Axis Rooms CM credentials — accessKey in JSON body, not Bearer header. */

export function getAxisRoomsAccessKey(): string | null {
  return process.env.AXIS_ROOMS_API_KEY?.trim() || null;
}

export function getAxisRoomsChannelId(): string | null {
  return process.env.AXIS_ROOMS_CHANNEL_ID?.trim() || null;
}

export function getAxisRoomsBaseUrl(): string {
  const raw =
    process.env.AXIS_ROOMS_API_BASE_URL?.trim() ||
    "https://sandbox2.axisrooms.com";
  return raw.replace(/\/$/, "");
}

/** Display name registered with Axis Rooms channel manager (reply to Axis onboarding). */
export function getAxisRoomsPmsName(): string {
  return process.env.AXIS_ROOMS_PMS_NAME?.trim() || "Jade Host PMS";
}

export function isAxisRoomsConfigured(): boolean {
  return Boolean(getAxisRoomsAccessKey() && getAxisRoomsChannelId());
}

export function axisRoomsApiUrl(path: string): string {
  const base = getAxisRoomsBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
