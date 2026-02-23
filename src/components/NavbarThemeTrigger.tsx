"use client";

import { useEffect } from "react";
import { useInView } from "framer-motion";
import { useAnimation } from "@/context/AnimationContext";

interface NavbarThemeTriggerProps {
  theme: "white" | "golden";
  sectionRef: React.RefObject<HTMLElement | HTMLDivElement>;
}

/**
 * NavbarThemeTrigger
 *
 * Place this inside a section to automatically update the Navbar's logo theme
 * when that section reaches the top of the viewport.
 */
export default function NavbarThemeTrigger({
  theme,
  sectionRef,
}: NavbarThemeTriggerProps) {
  const { setNavbarTheme } = useAnimation();

  // Trigger when the section hits the top area of the viewport
  // We use a small horizontal strip near the top (around where the Navbar sits)
  // margin: top right bottom left
  // -10% from top, -85% from bottom = a 5% tall strip starting 10% from top
  const isInView = useInView(sectionRef, {
    margin: "-10% 0px -85% 0px",
  });

  useEffect(() => {
    if (isInView) {
      setNavbarTheme(theme);
    }
  }, [isInView, theme, setNavbarTheme]);

  return null;
}
