"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import PrimaryButton from "@/components/PrimaryButton";
import ScrollLinkedHorizontalSection from "@/components/scroll-linked/ScrollLinkedHorizontalSection";
import ScrollLinkedPanelCard, {
  type ScrollLinkedPanelData,
} from "@/components/scroll-linked/ScrollLinkedPanelCard";
import { useScrollLinkedSectionHeight } from "@/lib/useScrollLinkedSectionHeight";

const CELEBRATIONS: ScrollLinkedPanelData[] = [
  {
    id: "mehendi",
    title: "Mehendi & Haldi",
    subtext:
      "Daytime rituals in private lawns and courtyards, with space to gather, move freely, and celebrate without interruption.",
    image: "/Experiences/Weddings/5-Pre Wedding/Haldi.webp",
    href: "/weddings",
    cta: "SEE THE RITUALS",
  },
  {
    id: "sangeet",
    title: "Sangeet Evenings",
    subtext:
      "Evenings shaped for music, performances, and dancing, supported by flexible lighting, sound, and open layouts.",
    image: "/Experiences/Weddings/5-Pre Wedding/Sangeeth.webp",
    href: "/weddings",
    cta: "EXPLORE THE VIBE",
  },
  {
    id: "bachelor",
    title: "Bachelor & Bachelorette Parties",
    subtext:
      "Fully private estates for carefree celebrations—poolside moments, music, décor, and late nights with friends.",
    image: "/Experiences/Weddings/5-Pre Wedding/Bachelorette.webp",
    href: "/party-villas",
    cta: "LEARN MORE",
  },
  {
    id: "cocktail",
    title: "Pre-Wedding Cocktail Nights",
    subtext:
      "Relaxed evening gatherings with custom bar setups, lounge seating, and ambient lighting.",
    image: "/Experiences/Weddings/5-Pre Wedding/cocktail...webp",
    href: "/weddings",
    cta: "SEE THE MAGIC",
  },
  {
    id: "shoots",
    title: "Pre-Wedding Shoots",
    subtext:
      "Multiple backdrops within one private estate, allowing your shoot to flow naturally from one setting to the next.",
    image: "/Experiences/Weddings/5-Pre Wedding/Bridal Shoots.webp",
    href: "/weddings",
    cta: "VIEW THE LOCATIONS",
  },
];

function EndButton({ panelProgress }: { panelProgress: MotionValue<number> }) {
  const opacity = useTransform(panelProgress, [0.85, 1.0], [0, 1]);
  const scale = useTransform(panelProgress, [0.85, 1.0], [0.8, 1]);
  const y = useTransform(panelProgress, [0.85, 1.0], [60, 0]);

  return (
    <motion.div
      style={{ opacity, scale, y, zIndex: 100 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="pointer-events-auto">
        <PrimaryButton
          href="/villas"
          width="section"
          className="shadow-[0_16px_40px_rgba(239,205,98,0.4)] hover:shadow-[0_20px_50px_rgba(239,205,98,0.6)] transition-transform duration-300 hover:scale-[1.03]"
        >
          <span className="font-bold whitespace-nowrap text-center">
            See All Wedding Villas
          </span>
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

export default function WeddingCelebrationsSection() {
  const totalSteps = CELEBRATIONS.length + 1;
  const panelCount = CELEBRATIONS.length;
  const sectionHeightVh = useScrollLinkedSectionHeight(
    "wedding",
    "mobileSnapOnly",
    totalSteps,
  );

  return (
    <ScrollLinkedHorizontalSection
      sectionHeightVh={sectionHeightVh}
      stepCount={totalSteps}
      bgClassName="bg-[#1A1C1E]"
      headerLabel="PRE WEDDING CELEBRATIONS"
      headerLabelClassName="font-manrope text-gh-label tracking-[0.3em] uppercase font-semibold text-[#EFCD62] drop-shadow-lg block"
      scrollMode="mobileSnapOnly"
      endButton={(panelProgress) => (
        <EndButton panelProgress={panelProgress} />
      )}
    >
      {(panelProgress) =>
        CELEBRATIONS.map((celebration, i) => (
          <ScrollLinkedPanelCard
            key={celebration.id}
            data={celebration}
            index={i}
            panelProgress={panelProgress}
            totalSteps={totalSteps}
            panelCount={panelCount}
            gapVariant="wide"
          />
        ))
      }
    </ScrollLinkedHorizontalSection>
  );
}
