import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { verifyAdminPassword } from "@/lib/security/adminAuth";
import { readJsonBody, SafeJsonError } from "@/lib/security/safeJson";
import { isSafePublicId } from "@/lib/security/ids";

export const dynamic = "force-dynamic";

const MAX_PATCH_BYTES = 8192;

function adminDenied(req: NextRequest) {
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
  return null;
}

/* ───────────────────────────────────────────────
   GET /api/bookings/[id]  — admin: fetch booking
─────────────────────────────────────────────── */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const deny = adminDenied(req);
  if (deny) return deny;

  if (!isSafePublicId(params.id)) {
    return NextResponse.json(
      { error: "Invalid booking id" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const ip = req.ip ?? getClientIpFromHeaders(req.headers);
    const rl = rateLimit({
      key: `bookings:admin_id_get:${ip}`,
      limit: 120,
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

    const result = await query(`SELECT * FROM bookings WHERE id = $1`, [
      params.id,
    ]);
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { booking: result.rows[0] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[GET /api/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
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
  const deny = adminDenied(req);
  if (deny) return deny;

  if (!isSafePublicId(params.id)) {
    return NextResponse.json(
      { error: "Invalid booking id" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const ip = req.ip ?? getClientIpFromHeaders(req.headers);
  const rl = rateLimit({
    key: `bookings:admin_id_patch:${ip}`,
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

  let status: unknown;
  try {
    const body = await readJsonBody(req, MAX_PATCH_BYTES);
    status =
      body &&
      typeof body === "object" &&
      body !== null &&
      "status" in body
        ? (body as { status?: unknown }).status
        : undefined;
  } catch (e) {
    if (e instanceof SafeJsonError) {
      return NextResponse.json(
        { error: e.message },
        { status: e.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    throw e;
  }

  const allowed = ["confirmed", "pending", "cancelled"];
  if (typeof status !== "string" || !allowed.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, params.id],
    );
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { success: true, booking: result.rows[0] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[PATCH /api/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

/* ───────────────────────────────────────────────
   DELETE /api/bookings/[id]  — remove booking
─────────────────────────────────────────────── */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const deny = adminDenied(req);
  if (deny) return deny;

  if (!isSafePublicId(params.id)) {
    return NextResponse.json(
      { error: "Invalid booking id" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const ip = req.ip ?? getClientIpFromHeaders(req.headers);
    const rl = rateLimit({
      key: `bookings:admin_id_delete:${ip}`,
      limit: 30,
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
      `DELETE FROM bookings WHERE id = $1 RETURNING id`,
      [params.id],
    );
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[DELETE /api/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
