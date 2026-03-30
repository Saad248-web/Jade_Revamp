"use client";

import { AnimationProvider } from "@/context/AnimationContext";
import SmoothScroll from "@/components/SmoothScroll";
import PartnerOverlay from "@/components/PartnerOverlay";
import RathaaOverlay from "@/components/RathaaOverlay";
import { BookingProvider } from "@/context/BookingContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnimationProvider>
      <BookingProvider>
        <WishlistProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <PartnerOverlay />
          <RathaaOverlay />
        </WishlistProvider>
      </BookingProvider>
    </AnimationProvider>
  );
}
