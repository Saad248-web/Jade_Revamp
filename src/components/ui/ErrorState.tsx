"use client";

import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
      <AlertCircle className="w-12 h-12 text-red-400/60" strokeWidth={1.5} />
      <p className="text-white/60 font-manrope text-gh-body max-w-xs">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="border border-white/20 text-white/70 font-manrope text-gh-label tracking-widest uppercase px-6 py-2.5 hover:border-white/50 hover:text-white transition-colors"
        >
          TRY AGAIN
        </button>
      )}
    </div>
  );
}
