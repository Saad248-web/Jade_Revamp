"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import PrimaryButton from "@/components/PrimaryButton";
import ScrollLinkedHorizontalSection from "@/components/scroll-linked/ScrollLinkedHorizontalSection";
import ScrollLinkedPanelCard, {
  type ScrollLinkedPanelData,
} from "@/components/scroll-linked/ScrollLinkedPanelCard";
import { experiencePanelHref, villaListingPath } from "@/lib/appRoutes";
import { useScrollLinkedSectionHeight } from "@/lib/useScrollLinkedSectionHeight";

const PANELS: ScrollLinkedPanelData[] = [
  {
    id: "weekend",
    title: "Weekend Getaways",
    subtext:
      "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone’s wishlist.",
    cta: "SEE WHAT A GETAWAY LOOKS LIKE",
    href: experiencePanelHref("Weekend Getaways"),
    image: "/Experiences/Weekend Getaways/1-Hero/casual stays.webp",
    mobileImage: "/Website Ratio Changes/Weekend_GetAways.webp",
  },
  {
    id: "celebrations",
    title: "Celebrations & Parties",
    subtext:
      "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse Villas with pools, open lawns, and entertainment-ready spaces.",
    cta: "SEE HOW CELEBRATIONS COME ALIVE",
    href: experiencePanelHref("Party Venues"),
    image: "/Home Page/2-Experiences/celebrations & parties.webp",
    mobileImage: "/Website Ratio Changes/POOL PARTY.webp",
  },
  {
    id: "weddings",
    title: "Weddings",
    subtext:
      "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    cta: "SEE HOW WEDDINGS UNFOLD",
    href: experiencePanelHref("Weddings"),
    image: "/Experiences/Weddings/1-Hero/2 (1).webp",
  },
  {
    id: "corporate",
    title: "Corporate Offsites",
    subtext:
      "Unwinding and ice-breaking sessions with colleagues, away from cubicles and glass walls, in private farmhouses ideal for offsites or workations.",
    cta: "SEE HOW TEAMS GATHER",
    href: experiencePanelHref("Corporate Retreats"),
    image: "/Experiences/Corporate Retreats/1-Hero/xhero.webp",
  },
  {
    id: "wellness",
    title: "Wellness Retreats",
    subtext:
      "Element-led wellness restoration through mud baths, massages, spa and aroma therapies, designed for deep rejuvenation.",
    cta: "SEE HOW RETREAT TAKES SHAPE",
    href: experiencePanelHref("Wellness Retreats"),
    image:
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Nature & Nearby Escapes.webp",
  },
  {
    id: "caravans",
    title: "Journeys in Caravans",
    subtext:
      "Luxury motor caravans carry the idea of private retreat onto the road, offering comfort and privacy for glamping, pilgrimages or any evolving journeys.",
    cta: "SEE HOW THE JOURNEY UNFOLDS",
    href: experiencePanelHref("caravans"),
    image: "/Experiences/Caravan/1-Hero/6.webp",
  },
  {
    id: "private-villas",
    title: "Private Villas",
    subtext:
      "A curated collection of fully private farmhouses, suited for everything from quiet stays to vibrant celebrations and bespoke experiences.",
    cta: "SEE THE Villas THAT HOST IT ALL",
    href: experiencePanelHref("villas"),
    image: "/Villa_Retreats/Magnolia/Hero/hero.webp",
    mobileImage: "/Website Ratio Changes/Magnoliaa.webp",
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
          href={villaListingPath()}
          width="section"
          className="shadow-[0_16px_40px_rgba(239,205,98,0.4)] hover:shadow-[0_20px_50px_rgba(239,205,98,0.6)] transition-transform duration-300 hover:scale-[1.03]"
        >
          <span className="font-bold whitespace-nowrap text-center">
            See Best Experience Villas
          </span>
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

export default function ExperiencesScrollSection() {
  const totalSteps = PANELS.length + 1;
  const panelCount = PANELS.length;
  const sectionHeightVh = useScrollLinkedSectionHeight("experiences");

  return (
    <ScrollLinkedHorizontalSection
      sectionHeightVh={sectionHeightVh}
      stepCount={totalSteps}
      bgClassName="bg-[#1A1C1E]"
      headerLabel="WAYS JADE IS EXPERIENCED"
      scrollMode="free"
      endButton={(panelProgress) => (
        <EndButton panelProgress={panelProgress} />
      )}
    >
      {(panelProgress) =>
        PANELS.map((panel, i) => (
          <ScrollLinkedPanelCard
            key={panel.id}
            data={panel}
            index={i}
            panelProgress={panelProgress}
            totalSteps={totalSteps}
            panelCount={panelCount}
          />
        ))
      }
    </ScrollLinkedHorizontalSection>
  );
}
