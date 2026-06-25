"use client";

import { Suspense } from "react";
import { MediaLibraryManager } from "@/components/dashboard/MediaLibraryManager";
import "@/styles/media-library.css";

export default function MediaLibraryPage() {
  return (
    <Suspense fallback={<p className="text-white/50">Loading media library…</p>}>
      <MediaLibraryManager />
    </Suspense>
  );
}
