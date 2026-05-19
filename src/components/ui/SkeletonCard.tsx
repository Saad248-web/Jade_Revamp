"use client";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col md:flex-row gap-5 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full md:w-[45%] md:flex-shrink-0 aspect-[4/3] md:max-h-[480px] bg-white/8 rounded-md" />

      {/* Details skeleton */}
      <div className="flex flex-col flex-1 gap-3 py-2">
        {/* Type label */}
        <div className="h-3 w-40 bg-white/10 rounded" />
        {/* Name */}
        <div className="h-8 w-56 bg-white/10 rounded" />
        {/* Location */}
        <div className="h-4 w-44 bg-white/8 rounded" />
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/8 rounded" />
          <div className="h-3 w-4/5 bg-white/8 rounded" />
          <div className="h-3 w-3/5 bg-white/8 rounded" />
        </div>
        {/* Stats row */}
        <div className="flex gap-3 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-20 bg-white/8 rounded" />
          ))}
        </div>
        {/* Tags */}
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-20 bg-white/5 border border-white/8 rounded-sm"
            />
          ))}
        </div>
        {/* Action row */}
        <div className="flex justify-between items-center mt-auto pt-4">
          <div className="h-4 w-24 bg-white/8 rounded" />
          <div className="flex gap-2.5">
            <div className="h-10 w-28 bg-white/8 rounded-sm" />
            <div className="h-10 w-28 bg-white/10 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
