import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/*
  GET /api/bookings/availability?villaId=magnolia&year=2026&month=0

  Returns an array of ISO date strings (YYYY-MM-DD) that are booked
  for the given villa in the given month (year + 0-indexed month).
  The frontend uses this to grey out dates on the calendar.
*/
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const villaId = searchParams.get("villaId");
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 0-indexed

  if (!villaId || isNaN(year) || isNaN(month)) {
    return NextResponse.json(
      { error: "villaId, year, and month are required" },
      { status: 400 },
    );
  }

  // First day and last day of requested month
  const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
  const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];

  try {
    // Use PostgreSQL generate_series to expand bookings into individual days.
    // This avoids all JS timezone issues — dates stay as plain text.
    const result = await query<{ booked_date: string }>(
      `SELECT DISTINCT gs::date::text AS booked_date
       FROM bookings,
            generate_series(check_in, check_out - interval '1 day', '1 day') gs
       WHERE villa_id = $1
         AND status != 'cancelled'
         AND check_in <= $3::date
         AND check_out > $2::date`,
      [villaId, firstDay, lastDay],
    );

    const bookedDates = result.rows.map((r) => r.booked_date);
    return NextResponse.json({ bookedDates });
  } catch (err) {
    console.error("[GET /api/bookings/availability]", err);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 },
    );
  }
}
