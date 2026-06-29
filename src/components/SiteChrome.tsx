"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

function showSiteChrome(pathname: string): boolean {
  return !pathname.startsWith("/dashboard") && pathname !== "/login";
}

/** Persistent top + bottom nav — survives client navigations without remounting. */
export default function SiteChrome() {
  const pathname = usePathname() ?? "";
  if (!showSiteChrome(pathname)) return null;

  return (
    <>
      <Navbar />
      <MobileBottomNav />
    </>
  );
}
