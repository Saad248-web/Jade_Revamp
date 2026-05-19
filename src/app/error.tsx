"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-[#0B2C23] px-6 py-20 text-center text-white">
      <p className="text-gh-label uppercase tracking-[0.2em] text-[#EFCD62]/80">
        Something interrupted this page
      </p>
      <h1 className="font-philosopher text-gh-h2">We couldn&apos;t load this view</h1>
      <p className="max-w-md font-manrope text-gh-desc text-white/65">
        {error.message ||
          "A client error occurred. You can retry, or head back home from the menu."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-sm bg-[#EFCD62] px-8 py-4 font-manrope text-sm font-bold uppercase tracking-widest text-[#0B2C23] transition-colors hover:bg-white"
      >
        Try again
      </button>
    </div>
  );
}
