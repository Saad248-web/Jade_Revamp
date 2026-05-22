import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { bookingDetailsFieldErrors } from "@/lib/bookingDetailsValidation";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { readJsonBody, SafeJsonError } from "@/lib/security/safeJson";
import { verifyAdminPassword } from "@/lib/security/adminAuth";
import { isRegisteredVillaId } from "@/lib/security/villaId";
import { isVillaBookable } from "@/lib/villaBooking";
import { notifyBookingCreated } from "@/lib/email/bookingNotifications";

const MAX_JSON_BYTES = 48 * 1024;
const MAX_VILLA_NAME_LEN = 200;

function isIsoDateOnly(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function isNonNegativeInt(n: unknown): n is number {
  return (
    typeof n === "number" &&
    Number.isFinite(n) &&
    Number.isInteger(n) &&
    n >= 0
  );
}

function isNonNegativeNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

function normalizeEmail(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const v = s.trim().toLowerCase();
  if (!v) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return null;
  return v;
}

function coerceString(v: unknown, maxLen: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, maxLen);
}

/* ───────────────────────────────────────────────
   POST /api/bookings  — create a new booking
─────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? getClientIpFromHeaders(req.headers);
    const rl = rateLimit({
      key: `bookings:post:${ip}`,
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.ok) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rl.retryAfterSeconds),
            "Cache-Control": "no-store",
          },
        },
      );
    }

    let body: unknown;
    try {
      body = await readJsonBody(req, MAX_JSON_BYTES);
    } catch (e) {
      if (e instanceof SafeJsonError) {
        return NextResponse.json(
          { error: e.message },
          { status: e.status, headers: { "Cache-Control": "no-store" } },
        );
      }
      throw e;
    }

    if (body === null || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid body" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const b = body as Record<string, unknown>;
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
    } = b;

    if (!isRegisteredVillaId(villaId)) {
      return NextResponse.json(
        { error: "Invalid or unknown villa" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isVillaBookable(villaId)) {
      return NextResponse.json(
        { error: "Online booking is not available for this villa" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const nameStr = coerceString(fullName, 200);
    const phoneStr = coerceString(phone, 32);
    const emailRaw = typeof email === "string" ? email : "";
    const notesStr = coerceString(notes, 2000);

    const detailErrors = bookingDetailsFieldErrors({
      fullName: nameStr,
      phone: phoneStr,
      email: emailRaw.trim(),
      notes: notesStr,
    });

    if (Object.keys(detailErrors).length > 0) {
      return NextResponse.json(
        { error: "Invalid contact details", fields: detailErrors },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!checkIn || !checkOut || !isIsoDateOnly(checkIn) || !isIsoDateOnly(checkOut)) {
      return NextResponse.json(
        { error: "checkIn/checkOut must be YYYY-MM-DD" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: "checkOut must be after checkIn" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (
      (adults !== undefined && !isNonNegativeInt(adults)) ||
      (children !== undefined && !isNonNegativeInt(children)) ||
      (pets !== undefined && !isNonNegativeInt(pets))
    ) {
      return NextResponse.json(
        { error: "adults/children/pets must be non-negative integers" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (
      (basePrice !== undefined && !isNonNegativeNumber(basePrice)) ||
      (addOnTotal !== undefined && !isNonNegativeNumber(addOnTotal)) ||
      (taxAmount !== undefined && !isNonNegativeNumber(taxAmount)) ||
      (totalPrice !== undefined && !isNonNegativeNumber(totalPrice))
    ) {
      return NextResponse.json(
        { error: "Prices must be non-negative numbers" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const villaDisplayName =
      typeof villaName === "string"
        ? villaName.trim().slice(0, MAX_VILLA_NAME_LEN)
        : "";

    if (!Array.isArray(addOns) && addOns !== undefined) {
      return NextResponse.json(
        { error: "addOns must be an array when provided" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }
    const addOnClean = Array.isArray(addOns)
      ? addOns.filter((x): x is string => typeof x === "string").slice(0, 50)
      : [];

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
        {
          error:
            "Selected dates are no longer available. Please choose different dates.",
        },
        { status: 409, headers: { "Cache-Control": "no-store" } },
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
        villaDisplayName || villaId,
        checkIn,
        checkOut,
        adults ?? 1,
        children ?? 0,
        pets ?? 0,
        nameStr,
        phoneStr,
        normalizedEmail,
        notesStr,
        addOnClean,
        basePrice,
        addOnTotal ?? 0,
        taxAmount ?? 0,
        totalPrice,
      ],
    );

    const booking = result.rows[0];

    void notifyBookingCreated({
      bookingId: String(booking.id),
      villaName: villaDisplayName || String(villaId),
      checkIn,
      checkOut,
      guestName: nameStr,
      guestEmail: normalizedEmail,
      guestPhone: phoneStr,
      totalPrice:
        typeof totalPrice === "number" && Number.isFinite(totalPrice)
          ? totalPrice
          : 0,
    }).catch((e) => console.error("[notifyBookingCreated]", e));

    return NextResponse.json(
      { success: true, bookingId: booking.id, createdAt: booking.created_at },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

/* ───────────────────────────────────────────────
   GET /api/bookings  — admin: list all bookings
   Requires header: x-admin-password
─────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const auth = verifyAdminPassword(req);
  if (auth === "missing_config") {
    return NextResponse.json(
      { error: "Admin authentication is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (auth !== "ok") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const ip = req.ip ?? getClientIpFromHeaders(req.headers);
    const rl = rateLimit({
      key: `bookings:admin_list:${ip}`,
      limit: 60,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.ok) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rl.retryAfterSeconds),
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const result = await query(
      `SELECT * FROM bookings ORDER BY created_at DESC`,
    );
    return NextResponse.json(
      { bookings: result.rows },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
