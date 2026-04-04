"use client";

import { useState } from "react";
import { VILLAS } from "@/lib/mockData";
import WeddingVillaCard from "./WeddingVillaCard";
import VenueOverlay from "./VenueOverlay";
import { AnimatePresence } from "framer-motion";

// Filter villas to specifically show all 6 Wedding related venues
const WEDDING_VILLA_IDS = [
  "dome-villas",
  "the-haven",
  "retreat-on-the-ridge",
  "tranquil-woods",
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
    <section className="relative bg-[#25282C] py-10">
      <div className="max-w-[1920px] mx-auto px-0 md:px-8 lg:px-16 w-full overflow-hidden">
        <div className="flex flex-col gap-10">
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
          />
        )}
      </AnimatePresence>
    </section>
  );
}
