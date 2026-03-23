"use client";

import { AnimationProvider } from "@/context/AnimationContext";
import SmoothScroll from "@/components/SmoothScroll";
import PartnerOverlay from "@/components/PartnerOverlay";
import RathaaOverlay from "@/components/RathaaOverlay";
import { BookingProvider } from "@/context/BookingContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnimationProvider>
      <BookingProvider>
        <SmoothScroll>{children}</SmoothScroll>
        <PartnerOverlay />
        <RathaaOverlay />
      </BookingProvider>
    </AnimationProvider>
  );
}
