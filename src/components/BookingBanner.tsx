"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function BookingBanner({ onSearch }: { onSearch?: () => void }) {
  const { dateRange, guests } = useBooking();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to format the date
  const formatDateRange = () => {
    if (!mounted) return "Add Dates"; // Render consistently on server
    if (!dateRange.checkIn && !dateRange.checkOut) return "Add Dates";

    const formatDayMonth = (date: { month: number; day: number } | null) => {
      if (!date) return "";
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${date.day} ${months[date.month]}`;
    };

    const inStr = formatDayMonth(dateRange.checkIn);
    const outStr = formatDayMonth(dateRange.checkOut);

    if (inStr && outStr) return `${inStr} - ${outStr}`;
    if (inStr) return `${inStr} - Add Checkout`;
    return "Add Dates";
  };

  // Helper to format guests
  const formatGuests = () => {
    if (!mounted) return "Add Guests"; // Render consistently on server
    const total = guests.adults + guests.children;
    if (total === 0) return "Add Guests";
    return `${total} Guest${total !== 1 ? "s" : ""}`;
  };

  return (
    <div className="w-full md:max-w-[70%] bg-[#252729] border border-white/10 p-2 sm:p-2.5 rounded flex items-center justify-between">
      <Link href="/book?step=dates" className="flex-1 flex min-w-0">
        <div className="flex-1 px-3 sm:px-4 cursor-pointer hover:bg-white/5 transition-colors rounded py-1 sm:py-2 min-w-0">
          <p className="text-[9px] sm:text-[10px] text-white/50 font-manrope font-bold tracking-widest uppercase mb-0.5 sm:mb-1">
            CHECK IN - CHECK OUT
          </p>
          <p className="text-white text-sm sm:text-base font-manrope whitespace-nowrap overflow-hidden text-ellipsis">
            {formatDateRange()}
          </p>
        </div>
      </Link>

      <div className="w-[1px] h-8 sm:h-10 bg-white/10 shrink-0 mx-1 sm:mx-2" />

      <Link href="/book?step=guests" className="flex-1 flex min-w-0">
        <div className="flex-1 px-3 sm:px-4 cursor-pointer hover:bg-white/5 transition-colors rounded py-1 sm:py-2 min-w-0">
          <p className="text-[9px] sm:text-[10px] text-white/50 font-manrope font-bold tracking-widest uppercase mb-0.5 sm:mb-1">
            GUESTS
          </p>
          <p className="text-white text-sm sm:text-base font-manrope whitespace-nowrap overflow-hidden text-ellipsis">
            {formatGuests()}
          </p>
        </div>
      </Link>

      <button
        onClick={onSearch}
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 hover:bg-white/5 transition-colors rounded cursor-pointer ml-1 sm:ml-2"
        aria-label="Search Villas"
      >
        <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 hover:text-white transition-colors" />
      </button>
    </div>
  );
}
