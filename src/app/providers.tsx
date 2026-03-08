"use client";

import { AnimationProvider } from "@/context/AnimationContext";
import SmoothScroll from "@/components/SmoothScroll";
import PartnerOverlay from "@/components/PartnerOverlay";
import { BookingProvider } from "@/context/BookingContext";
import MenuOverlay from "@/components/MenuOverlay";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnimationProvider>
      <BookingProvider>
        <SmoothScroll>{children}</SmoothScroll>
        <PartnerOverlay />
        <MenuOverlay />
      </BookingProvider>
    </AnimationProvider>
  );
}
