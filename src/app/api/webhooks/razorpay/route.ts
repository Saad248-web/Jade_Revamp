import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpayWebhookVerify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isBookingUuid(id: unknown): id is string {
  if (typeof id !== "string" || id.length > 48) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v !== null && typeof v === "object"
    ? (v as Record<string, unknown>)
    : null;
}

function bookingUuidFromNotes(
  notes: Record<string, unknown> | undefined,
): string | null {
  if (!notes) return null;
  const u = notes.booking_uuid ?? notes.booking_id;
  return typeof u === "string" && isBookingUuid(u) ? u : null;
}

function extractPaymentWebhookFields(
  parsed: unknown,
): { bookingUuid: string | null; payId: string | null } {
  const root = asRecord(parsed);
  const payload = asRecord(root?.payload);
  const paymentWrap = asRecord(payload?.payment);
  const entity = asRecord(paymentWrap?.entity);
  const notes = asRecord(entity?.notes);
  const rawId = entity?.id;

  const payId =
    typeof rawId === "string" && rawId.startsWith("pay_") ? rawId : null;

  return {
    bookingUuid: bookingUuidFromNotes(notes ?? undefined),
    payId,
  };
}

/** Razorpay webhooks → mark linked bookings paid when payment notes carry `booking_uuid`. */
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const rawBody = await req.text();
  const sig =
    req.headers.get("x-razorpay-signature") ??
    req.headers.get("X-Razorpay-Signature");

  if (
    !verifyRazorpayWebhookSignature(
      rawBody,
      typeof sig === "string" ? sig : null,
      secret,
    )
  ) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const root = asRecord(parsed);
  const evt =
    typeof root?.event === "string" ? root.event : "";

  try {
    if (evt === "payment.captured") {
      const { bookingUuid, payId } = extractPaymentWebhookFields(parsed);
      if (bookingUuid && payId) {
        await query(
          `UPDATE bookings
           SET razorpay_payment_id = $1,
               payment_gateway_state = 'paid'
           WHERE id = $2::uuid
             AND (razorpay_payment_id IS NULL OR razorpay_payment_id = '')
             AND status != 'cancelled'`,
          [payId, bookingUuid],
        );
      }
    } else if (evt === "payment.failed") {
      const { bookingUuid } = extractPaymentWebhookFields(parsed);
      if (bookingUuid) {
        await query(
          `UPDATE bookings
           SET payment_gateway_state = 'failed'
           WHERE id = $1::uuid AND payment_gateway_state != 'paid'
             AND status != 'cancelled'`,
          [bookingUuid],
        );
      }
    }
  } catch (e) {
    console.error("[webhooks/razorpay] handler", e);
  }

  return NextResponse.json(
    { ok: true, digest: crypto.randomUUID() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
