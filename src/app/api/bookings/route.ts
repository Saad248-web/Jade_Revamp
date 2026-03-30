import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/* ───────────────────────────────────────────────
   POST /api/bookings  — create a new booking
─────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      villaId,
      villaName,
      checkIn,
      checkOut,
      adults,
      children,
      pets,
      fullName,
      phone,
      email,
      notes,
      addOns,
      basePrice,
      addOnTotal,
      taxAmount,
      totalPrice,
    } = body;

    // Basic validation
    if (
      !villaId ||
      !checkIn ||
      !checkOut ||
      !fullName ||
      !phone ||
      !email
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check for conflicts — no overlapping bookings for same villa
    const conflict = await query(
      `SELECT id FROM bookings
       WHERE villa_id = $1
         AND status != 'cancelled'
         AND check_in < $3
         AND check_out > $2`,
      [villaId, checkIn, checkOut],
    );

    if (conflict.rowCount && conflict.rowCount > 0) {
      return NextResponse.json(
        { error: "Selected dates are no longer available. Please choose different dates." },
        { status: 409 },
      );
    }

    const result = await query(
      `INSERT INTO bookings
         (villa_id, villa_name, check_in, check_out,
          adults, children, pets,
          full_name, phone, email, notes,
          add_ons, base_price, add_on_total, tax_amount, total_price,
          status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'confirmed')
       RETURNING id, created_at`,
      [
        villaId,
        villaName,
        checkIn,
        checkOut,
        adults ?? 1,
        children ?? 0,
        pets ?? 0,
        fullName,
        phone,
        email,
        notes ?? "",
        addOns ?? [],
        basePrice,
        addOnTotal ?? 0,
        taxAmount ?? 0,
        totalPrice,
      ],
    );

    const booking = result.rows[0];

    return NextResponse.json(
      { success: true, bookingId: booking.id, createdAt: booking.created_at },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 },
    );
  }
}

/* ───────────────────────────────────────────────
   GET /api/bookings  — admin: list all bookings
   Requires header: x-admin-password
─────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const adminPassword = req.headers.get("x-admin-password");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await query(
      `SELECT * FROM bookings ORDER BY created_at DESC`,
    );
    return NextResponse.json({ bookings: result.rows });
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
