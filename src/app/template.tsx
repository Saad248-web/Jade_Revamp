"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollToPageTopWithRetries } from "@/lib/scrollToPageTop";
import {
  VILLA_LISTING_FOCUS_PARAM,
  VILLA_LISTING_FOCUS_RESULTS,
} from "@/lib/appRoutes";

/**
 * App Router template remounts on every navigation — guarantees scroll reset on all pages.
 * Skips reset when booking flow lands on villa results (`?focus=listing`).
 */
export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const skipTopForListingFocus =
    pathname === "/villas" &&
    searchParams?.get(VILLA_LISTING_FOCUS_PARAM) === VILLA_LISTING_FOCUS_RESULTS;

  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (skipTopForListingFocus) return;
    scrollToPageTopWithRetries();
  }, [skipTopForListingFocus]);

  return <>{children}</>;
}
