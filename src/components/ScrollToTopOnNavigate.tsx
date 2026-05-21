"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollToPageTopWithRetries } from "@/lib/scrollToPageTop";

/**
 * Ensures every route change, refresh, redirect, and back/forward starts at the hero/first section.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";
  const routeKey = search ? `${pathname}?${search}` : pathname;

  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    scrollToPageTopWithRetries();
  }, [routeKey]);

  useEffect(() => {
    const onPopState = () => scrollToPageTopWithRetries();
    const onPageShow = () => scrollToPageTopWithRetries();

    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
