import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { readJsonBody, SafeJsonError } from "@/lib/security/safeJson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY = 12 * 1024;

function isBookingUuid(id: unknown): id is string {
  if (typeof id !== "string" || id.length > 48) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

/** Creates a Razorpay order server-side when keys are configured. Amount is in INR sub-units (paise). */
export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? getClientIpFromHeaders(req.headers);
    const rl = rateLimit({
      key: `payments:rzp:${ip}`,
      limit: 30,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.ok) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests" }),
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

    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { configured: false, error: "Payments are not configured" },
        {
          status: 501,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    let body: unknown;
    try {
      body = await readJsonBody(req, MAX_BODY);
    } catch (e) {
      if (e instanceof SafeJsonError) {
        return NextResponse.json(
          { error: e.message },
          { status: e.status, headers: { "Cache-Control": "no-store" } },
        );
      }
      throw e;
    }

    const b =
      typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
    const amountSubunits = typeof b.amountSubunits === "number" ? b.amountSubunits : NaN;
    const receiptRaw =
      typeof b.receipt === "string" && b.receipt.trim()
        ? b.receipt.trim()
        : `rc${Date.now()}`;
    const receipt = receiptRaw.replace(/\W+/g, "").slice(0, 40) || `rc${Date.now()}`;

    const booking_uuid =
      typeof b.booking_uuid === "string" && isBookingUuid(b.booking_uuid)
        ? b.booking_uuid
        : typeof b.bookingId === "string" && isBookingUuid(b.bookingId)
          ? b.bookingId
          : null;

    if (!Number.isInteger(amountSubunits) || amountSubunits < 100) {
      return NextResponse.json(
        { error: "amountSubunits must be an integer paise >= 100" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`, "utf8").toString("base64");

    const notes: Record<string, string> = {};
    if (booking_uuid) {
      notes.booking_uuid = booking_uuid;
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountSubunits,
        currency: "INR",
        receipt,
        payment_capture: 1,
        ...(Object.keys(notes).length ? { notes } : {}),
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: "Razorpay order failed", detail: payload },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const orderId = (payload as { id?: string }).id;

    if (booking_uuid && orderId) {
      try {
        await query(
          `UPDATE bookings
           SET razorpay_order_id = $1,
               payment_gateway_state = CASE
                 WHEN COALESCE(trim(payment_gateway_state), '') IN ('none', '', 'failed')
                 THEN 'checkout_started'
                 ELSE payment_gateway_state
               END
           WHERE id = $2::uuid
             AND status != 'cancelled'
             AND (razorpay_order_id IS NULL OR trim(razorpay_order_id) = '')`,
          [orderId, booking_uuid],
        );
      } catch (e) {
        console.warn("[POST /api/payments/razorpay-order] booking link skipped", e);
      }
    }

    return NextResponse.json(
      {
        configured: true,
        orderId,
        amount: amountSubunits,
        currency: "INR",
        keyId,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[POST /api/payments/razorpay-order]", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
