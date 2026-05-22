/** VILLAS shown in the directory but not available for online booking. */
export const NON_BOOKABLE_VILLA_IDS = new Set<string>(["royalty", "palatio"]);

export function isVillaBookable(villaId: string | null | undefined): boolean {
  if (!villaId) return true;
  return !NON_BOOKABLE_VILLA_IDS.has(villaId);
}

export function isVillaRecordBookable(villa: {
  id: string;
  bookable?: boolean;
}): boolean {
  if (villa.bookable === false) return false;
  return isVillaBookable(villa.id);
}
