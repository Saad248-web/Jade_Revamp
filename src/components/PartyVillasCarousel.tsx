"use client";

import { useState } from "react";
import { VILLAS } from "@/lib/mockData";
import PartyVillaCard from "./PartyVillaCard";
import PartyVenueOverlay from "./PartyVenueOverlay";
import { AnimatePresence } from "framer-motion";

// Filter villas for Party page: Dome, Emerald, Magnolia, Tranquil Woods, Wonderland Treehouse, Vannani
const PARTY_VILLA_IDS = [
  "dome-villas",
  "emerald",
  "magnolia",
  "tranquil",
  "wonderland",
  "vannani",
];

const PARTY_VILLAS = VILLAS.filter((villa) =>
  PARTY_VILLA_IDS.includes(villa.id),
).sort((a, b) => PARTY_VILLA_IDS.indexOf(a.id) - PARTY_VILLA_IDS.indexOf(b.id));

export default function PartyVillasCarousel() {
  const [selectedVilla, setSelectedVilla] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleKnowMore = (villa: any) => {
    setSelectedVilla(villa);
    setIsOverlayOpen(true);
  };

  return (
    <section
      id="party-villas-section"
      className="relative bg-[#25282C] pt-fluid-lg pb-8 md:pt-fluid-xl md:pb-8"
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full overflow-hidden">
        <div className="flex flex-col gap-11">
          {PARTY_VILLAS.map((villa) => (
            <PartyVillaCard
              key={villa.id}
              villa={villa}
              onKnowMore={() => handleKnowMore(villa)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOverlayOpen && (
          <PartyVenueOverlay
            isOpen={isOverlayOpen}
            onClose={() => setIsOverlayOpen(false)}
            villa={selectedVilla}
            overlayPage="party"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
