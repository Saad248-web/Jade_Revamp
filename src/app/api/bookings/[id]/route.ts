import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

/* ───────────────────────────────────────────────
   GET /api/bookings/[id]  — admin: fetch booking
─────────────────────────────────────────────── */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await query(`SELECT * FROM bookings WHERE id = $1`, [
      params.id,
    ]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ booking: result.rows[0] });
  } catch (err) {
    console.error("[GET /api/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

/* ───────────────────────────────────────────────
   PATCH /api/bookings/[id]  — update status
─────────────────────────────────────────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  const allowed = ["confirmed", "pending", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const result = await query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, params.id],
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error("[PATCH /api/bookings/[id]]", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

/* ───────────────────────────────────────────────
   DELETE /api/bookings/[id]  — remove booking
─────────────────────────────────────────────── */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await query(
      `DELETE FROM bookings WHERE id = $1 RETURNING id`,
      [params.id],
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/bookings/[id]]", err);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
