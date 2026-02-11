"use client";

import { AnimationProvider } from "@/context/AnimationContext";
import SmoothScroll from "@/components/SmoothScroll";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnimationProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </AnimationProvider>
  );
}
