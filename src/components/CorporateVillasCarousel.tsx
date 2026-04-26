"use client";

import { useState } from "react";
import { VILLAS } from "@/lib/mockData";
import CorporateVillaCard from "./CorporateVillaCard";
import CorporateVenueOverlay from "./CorporateVenueOverlay";
import { AnimatePresence } from "framer-motion";

// Filter villas to specifically show corporate related venues
const CORPORATE_VILLA_IDS = [
  "dome-villas",
  "magnolia",
  "diamond",
  "retreat-on-the-ridge",
  "the-haven",
];

const CORPORATE_VILLAS = VILLAS.filter((villa) =>
  CORPORATE_VILLA_IDS.includes(villa.id),
);

export default function CorporateVillasCarousel() {
  const [selectedVilla, setSelectedVilla] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleKnowMore = (villa: any) => {
    setSelectedVilla(villa);
    setIsOverlayOpen(true);
  };

  return (
    <section
      id="featured-venues"
      className="relative bg-[#1A1C1E] pt-fluid-lg pb-10 md:pt-fluid-xl md:pb-10"
    >
      <div className="max-w-7xl mx-auto px-6 w-full overflow-hidden">
        <div className="flex flex-col gap-14">
          {CORPORATE_VILLAS.map((villa) => (
            <CorporateVillaCard
              key={villa.id}
              villa={villa}
              onKnowMore={() => handleKnowMore(villa)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOverlayOpen && (
          <CorporateVenueOverlay
            isOpen={isOverlayOpen}
            onClose={() => setIsOverlayOpen(false)}
            villa={selectedVilla}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
