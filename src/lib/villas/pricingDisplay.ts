import type { CanonicalVilla } from "./canonicalPortfolio";

function fmtRupees(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function perHead(base: number, pax: number): string {
  if (pax <= 0) return "";
  const per = Math.round(base / pax);
  return `≈ ${fmtRupees(per)} / head`;
}

/** Public-facing pricing block aligned with Jade_Property_Data.md rates. */
export function buildPricingDisplay(v: CanonicalVilla) {
  const stayBase = v.basePriceRupees;
  const dayOutBase = v.dayOutBasePriceRupees;

  const stay = {
    title: "Stay Experience",
    subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
    packages: [
      {
        label: `Up to ${v.stayBasePax} PAX`,
        sublabel: perHead(stayBase, v.stayBasePax),
        price: `${fmtRupees(stayBase)} + GST (18%)`,
      },
      {
        label: "Additional Guest",
        price: `${fmtRupees(v.extraPaxStayRupees)} + GST / head`,
      },
    ],
    features: [
      "Private villa access",
      "Overnight stay",
      "Complimentary breakfast",
    ],
  };

  const event =
    v.weddingVenue && v.weddingTiers.length > 0
      ? {
          title: "Wedding & Events",
          subtitle: "Half-day or full-day packages · catering separate",
          packages: v.weddingTiers.map((t) => ({
            label: t.label,
            sublabel: `Up to ${t.maxGuests} guests`,
            price: `${fmtRupees(t.priceRupees)} + GST`,
          })),
          features: [
            "Lawn & venue access",
            "Stay inclusion on full-day tiers only",
          ],
        }
      : {
          title: "Day-out Experience",
          subtitle: "Single day · no overnight",
          packages: [
            {
              label: `Up to ${v.dayOutBasePax} PAX`,
              sublabel: perHead(dayOutBase, v.dayOutBasePax),
              price: `${fmtRupees(dayOutBase)} + GST (18%)`,
            },
            {
              label: "Additional Guest",
              price: `${fmtRupees(v.extraPaxDayOutRupees)} + GST / head`,
            },
          ],
          features: ["Venue access", "Complimentary high tea"],
        };

  return { stay, event };
}
