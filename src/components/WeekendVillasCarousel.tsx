"use client";

import { useState } from "react";
import { VILLAS } from "@/lib/mockData";
import WeekendVillaCard from "./WeekendVillaCard";
import VenueOverlay from "./VenueOverlay";
import { AnimatePresence } from "framer-motion";

// Filter villas to specifically show Weekend related venues
// Using IDs that were present in the weekend-getaways page
const WEEKEND_VILLA_IDS = ["dome-villas", "magnolia", "haven", "tranquil"];

const WEEKEND_VILLAS = VILLAS.filter((villa) =>
  WEEKEND_VILLA_IDS.includes(villa.id),
);

export default function WeekendVillasCarousel() {
  const [selectedVilla, setSelectedVilla] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleKnowMore = (villa: any) => {
    setSelectedVilla(villa);
    setIsOverlayOpen(true);
  };

  return (
    <section className="relative bg-[#25282C] pt-fluid-lg pb-10 md:pt-fluid-xl md:pb-10">
      <div className="max-w-7xl mx-auto px-6 w-full overflow-hidden">
        <div className="flex flex-col gap-14">
          {WEEKEND_VILLAS.map((villa) => (
            <WeekendVillaCard
              key={villa.id}
              villa={villa}
              onKnowMore={() => handleKnowMore(villa)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOverlayOpen && (
          <VenueOverlay
            isOpen={isOverlayOpen}
            onClose={() => setIsOverlayOpen(false)}
            villa={selectedVilla}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
