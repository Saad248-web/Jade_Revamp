"use client";

import { useState } from "react";
import { VILLAS } from "@/lib/mockData";
import { getOverlayVillaData } from "@/lib/overlayVillaData";
import { WEDDING_VILLA_IDS } from "@/data/overlays_data/wedding/villas/index";
import WeddingVillaCard from "./WeddingVillaCard";
import VenueOverlay from "./VenueOverlay";
import { AnimatePresence } from "framer-motion";

const WEDDING_VILLAS = WEDDING_VILLA_IDS.map((id) => {
  const base = VILLAS.find((v) => v.id === id);
  return getOverlayVillaData("wedding", id) ?? base ?? null;
}).filter(Boolean);

export default function WeddingVillasCarousel() {
  const [selectedVilla, setSelectedVilla] = useState<any>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleKnowMore = (villa: any) => {
    setSelectedVilla(villa);
    setIsOverlayOpen(true);
  };

  return (
    <section className="relative bg-[#25282C] pt-fluid-lg pb-8 md:pt-fluid-xl md:pb-8">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full overflow-hidden">
        <div className="flex flex-col gap-11">
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
