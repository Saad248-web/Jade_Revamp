"use client";

import { Home, Download } from "lucide-react";
import { useRef } from "react";
import ExperienceHero, { HeroButton } from "./ExperienceHero";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

export default function WeddingHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const heroButtons: [HeroButton, HeroButton] = [
    {
      icon: <Home className="w-4 h-4" />,
      label: "Venues",
      onClick: () => {
        const venuesSection = document.getElementById("wedding-venues");
        if (venuesSection) {
          venuesSection.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    {
      icon: <Download className="w-4 h-4" />,
      label: "Brochure",
      onClick: () => {
        window.open("/brochure.pdf", "_blank");
      },
    },
  ];

  return (
    <ExperienceHero
      ref={sectionRef}
      backgroundImage="/assets/Wedding_for_Both.png"
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
