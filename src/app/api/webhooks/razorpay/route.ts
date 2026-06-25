import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { getBookingStore } from "@/lib/bookings/mongoStore";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpayWebhookVerify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function asRecord(v: unknown): Record<string, unknown> | null {
  return v !== null && typeof v === "object"
    ? (v as Record<string, unknown>)
    : null;
}

function extractWebhookFields(parsed: unknown): {
  bookingId: string | null;
  payId: string | null;
  eventId: string | null;
} {
  const root = asRecord(parsed);
  const payload = asRecord(root?.payload);
  const paymentWrap = asRecord(payload?.payment);
  const entity = asRecord(paymentWrap?.entity);
  const notes = asRecord(entity?.notes);
  const rawId = entity?.id;
  const payId =
    typeof rawId === "string" && rawId.startsWith("pay_") ? rawId : null;
  const bookingId =
    typeof notes?.booking_id === "string"
      ? notes.booking_id
      : typeof notes?.booking_uuid === "string"
        ? notes.booking_uuid
        : null;
  const eventId =
    typeof root?.id === "string"
      ? root.id
      : crypto.createHash("sha256").update(JSON.stringify(parsed)).digest("hex");

  return { bookingId, payId, eventId };
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
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
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const root = asRecord(parsed);
  const evt = typeof root?.event === "string" ? root.event : "";

  try {
    if (evt === "payment.captured") {
      const { bookingId, payId, eventId } = extractWebhookFields(parsed);
      if (bookingId && payId && eventId) {
        const store = getBookingStore();
        const booking = await store.findById(bookingId);
        if (booking?.payment.orderId) {
          await store.confirmPayment({
            bookingId,
            orderId: booking.payment.orderId,
            paymentId: payId,
            eventId,
          });
        }
      }
    }
  } catch (e) {
    console.error("[webhooks/razorpay]", e);
  }

  return NextResponse.json({ ok: true });
}
