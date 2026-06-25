"use client";

import { Suspense } from "react";
import { RedirectManager } from "@/components/dashboard/seo/RedirectManager";

export default function RedirectsPage() {
  return (
    <Suspense fallback={<p className="text-white/50">Loading redirects…</p>}>
      <RedirectManager />
    </Suspense>
  );
}
