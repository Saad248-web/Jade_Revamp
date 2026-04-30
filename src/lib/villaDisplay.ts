export type PricingMode = "stay" | "event" | "auto";

function firstNumber(s?: string | null) {
  if (!s) return null;
  const m = String(s).match(/(\d[\d,]*)/);
  if (!m?.[1]) return null;
  return parseInt(m[1].replace(/,/g, ""), 10);
}

function maxNumberFromRange(s?: string | null) {
  if (!s) return null;
  const raw = String(s);
  // Match "10-30 Guests", "50 - 500", etc.
  const range = raw.match(/(\d[\d,]*)\s*-\s*(\d[\d,]*)/);
  if (range?.[2]) return parseInt(range[2].replace(/,/g, ""), 10);
  return firstNumber(raw);
}

export function getEventCapacity(villa: any): number | null {
  return maxNumberFromRange(villa?.stats?.events);
}

export function getStayCapacity(villa: any): number | null {
  // Some data contains "15 Guests" or "15 Guests Ref/..." strings
  const raw = String(villa?.stats?.stay ?? "");
  const cleaned = raw.split("Ref/")[0];
  return maxNumberFromRange(cleaned);
}

export function getBhk(villa: any): number | null {
  return firstNumber(villa?.stats?.bhk);
}

export function getStartingFromPrice(villa: any, mode: PricingMode = "auto") {
  const pricing = villa?.pricing as any | undefined;
  if (!pricing) return null;

  const pick = (key: "stay" | "event") =>
    pricing?.[key]?.packages?.[0]?.price as string | undefined;

  const priceRaw =
    mode === "stay"
      ? pick("stay")
      : mode === "event"
        ? pick("event")
        : pick("stay") || pick("event");

  if (!priceRaw) return null;

  // Display cleanly (remove "+ taxes" but keep currency + commas)
  return priceRaw.replace(/\s*\+\s*taxes\s*/i, "").trim();
}

