"use client";

import { Suspense } from "react";
import { BlogPagesManager } from "@/components/dashboard/BlogPagesManager";

export default function SeoBlogsPage() {
  return (
    <Suspense fallback={<p className="text-white/50">Loading blogs…</p>}>
      <BlogPagesManager />
    </Suspense>
  );
}
