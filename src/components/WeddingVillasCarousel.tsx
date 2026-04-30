"use client";

import { useState } from "react";
import { VILLAS } from "@/lib/mockData";
import WeddingVillaCard from "./WeddingVillaCard";
import VenueOverlay from "./VenueOverlay";
import { AnimatePresence } from "framer-motion";

// Filter villas to specifically show all 6 Wedding related venues
const WEDDING_VILLA_IDS = [
  "dome-villas",
  "haven",
  "retreat-on-the-ridge",
  "tranquil",
  "magnolia",
  "diamond",
];

const WEDDING_VILLAS = VILLAS.filter((villa) =>
  WEDDING_VILLA_IDS.includes(villa.id),
);

export default function WeddingVillasCarousel() {
  const [selectedVilla, setSelectedVilla] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleKnowMore = (villa: any) => {
    setSelectedVilla(villa);
    setIsOverlayOpen(true);
  };

  return (
    <section className="relative bg-[#25282C] pt-fluid-lg pb-10 md:pt-fluid-xl md:pb-10">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full overflow-hidden">
        <div className="flex flex-col gap-14">
          {WEDDING_VILLAS.map((villa) => (
            <WeddingVillaCard
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
            context="wedding"
            overlayPage="wedding"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
