"use client";

import { useEffect } from "react";
import { scrollToPageTopWithRetries } from "@/lib/scrollToPageTop";

/**
 * App Router template remounts on every navigation — guarantees scroll reset on all pages.
 */
export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    scrollToPageTopWithRetries();
  }, []);

  return <>{children}</>;
}
