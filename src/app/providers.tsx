"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AnimationProvider } from "@/context/AnimationContext";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollLinkedViewportSync from "@/components/ScrollLinkedViewportSync";
import HScrollTouchAssurance from "@/components/HScrollTouchAssurance";
import ScrollToTopOnNavigate from "@/components/ScrollToTopOnNavigate";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SiteChrome from "@/components/SiteChrome";
import { BookingProvider } from "@/context/BookingContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { MotionConfig } from "framer-motion";

const PartnerOverlay = dynamic(() => import("@/components/PartnerOverlay"), {
  ssr: false,
});
const RathaaOverlay = dynamic(() => import("@/components/RathaaOverlay"), {
  ssr: false,
});
const EnquireOverlay = dynamic(() => import("@/components/EnquireOverlay"), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <GoogleAnalytics />
      <AnimationProvider>
        <BookingProvider>
          <WishlistProvider>
            <SmoothScroll>
              <ScrollLinkedViewportSync />
              <HScrollTouchAssurance />
              <Suspense fallback={null}>
                <ScrollToTopOnNavigate />
              </Suspense>
              {children}
            </SmoothScroll>
            <SiteChrome />
            <PartnerOverlay />
            <RathaaOverlay />
            <EnquireOverlay />
          </WishlistProvider>
        </BookingProvider>
      </AnimationProvider>
    </MotionConfig>
  );
}
