"use client";

import ScrollSectionComposer from "./ScrollSectionComposer";
import LiveBackground from "./LiveBackground";
import {
  EXPERIENCE_SCROLL_SECTIONS,
  type ExperienceScrollVariant,
} from "@/data/experienceScrollSections";

interface ExperienceScrollSectionProps {
  variant: ExperienceScrollVariant;
  height?: string;
}

export default function ExperienceScrollSection({
  variant,
  height: heightOverride,
}: ExperienceScrollSectionProps) {
  const { label, body, height } = EXPERIENCE_SCROLL_SECTIONS[variant];

  const isWedding = variant === "wedding";

  return (
    <ScrollSectionComposer
      slides={[{ label, lines: [body] }]}
      height={heightOverride ?? height ?? "250vh"}
      scrollEffects={isWedding ? "performance" : "full"}
      background={
        isWedding ? <LiveBackground variant="static" /> : <LiveBackground />
      }
    />
  );
}
