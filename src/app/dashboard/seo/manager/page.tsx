"use client";

import { Suspense } from "react";
import { SeoManagerDashboard } from "@/components/dashboard/seo/SeoManagerDashboard";
import "@/styles/seo-manager.css";

export default function SeoManagerPage() {
  return (
    <Suspense fallback={<p className="text-white/50">Loading SEO Manager…</p>}>
      <SeoManagerDashboard />
    </Suspense>
  );
}
