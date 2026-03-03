"use client";

import { AnimationProvider } from "@/context/AnimationContext";
import SmoothScroll from "@/components/SmoothScroll";
import PartnerOverlay from "@/components/PartnerOverlay";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnimationProvider>
      <SmoothScroll>{children}</SmoothScroll>
      <PartnerOverlay />
    </AnimationProvider>
  );
}
