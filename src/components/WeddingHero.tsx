"use client";

import { Home, Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ExperienceHero, { HeroButton } from "./ExperienceHero";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import { scrollToExperienceVillaSection } from "@/lib/experiencePageVillaScroll";

export default function WeddingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/experiences/weddings/media");
        if (!res.ok) return;
        const data = await res.json();
        const group = (data?.groups || []).find(
          (g: any) => g.folder?.toLowerCase?.() === "1-hero",
        );
        const images = (group?.images || data?.all || []).filter(Boolean);
        if (!cancelled) setHeroImages(images);
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroBg = useMemo(() => heroImages[0] || "", [heroImages]);

  const heroButtons: [HeroButton, HeroButton] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Venues",
      onClick: () => scrollToExperienceVillaSection("wedding"),
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: "Brochure",
      onClick: () => {
        window.open("/All Properties - Jade Hospitainment.pdf", "_blank");
      },
    },
  ];

  return (
    <ExperienceHero
      ref={sectionRef}
      scrollTargetId="wedding-philosophy"
      backgroundImage={heroBg}
      backgroundAlt="Boutique Weddings"
      heading={
        <>
          Boutique Weddings <br /> Set in Nature
        </>
      }
      description="Private farmhouse and garden estates around Bangalore, designed for intimate ceremonies or large, multi-day celebrations."
      buttons={heroButtons}
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />
    </ExperienceHero>
  );
}
