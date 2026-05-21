"use client";

import { useEffect } from "react";

/**
 * App Router template remounts on every navigation.
 * Scroll-to-top runs in ScrollToTopOnNavigate (route key) — avoid duplicate Lenis fights here.
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
  }, []);

  return <>{children}</>;
}
