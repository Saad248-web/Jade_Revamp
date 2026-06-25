import { NextRequest, NextResponse } from "next/server";
import { auditLog } from "@/lib/audit/auditLog";
import { timingSafeStringEqual } from "@/lib/security/timingSafe";

export const dynamic = "force-dynamic";

function verifyAxisRoomsWebhook(req: NextRequest): boolean {
  const webhookSecret = process.env.AXIS_ROOMS_WEBHOOK_SECRET?.trim();
  if (webhookSecret) {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    return timingSafeStringEqual(token, webhookSecret);
  }

  const apiKey = process.env.AXIS_ROOMS_API_KEY?.trim();
  if (!apiKey) return false;
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  return timingSafeStringEqual(token, apiKey);
}

/** Axis Rooms inbound webhook — processes OTA reservations when payload spec is live. */
export async function POST(req: NextRequest) {
  if (!process.env.AXIS_ROOMS_API_KEY?.trim()) {
    return NextResponse.json(
      {
        ok: false,
        blocked: "AXIS_ROOMS_API_KEY not configured — see NEEDS_FROM_USER.md",
      },
      { status: 503 },
    );
  }

  if (!verifyAxisRoomsWebhook(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const { parseAxisRoomsInbound } = await import(
      "@/lib/axisRooms/parseInbound"
    );
    const parsed = parseAxisRoomsInbound(payload);

    await auditLog({
      action: "axisrooms.inbound",
      targetType: "webhook",
      metadata: {
        eventType: parsed?.eventType ?? "unknown",
        keys: Object.keys((payload as object) ?? {}),
      },
    });

    // Full booking upsert wired when Axis Rooms provides payload contract
    return NextResponse.json({
      ok: true,
      received: true,
      eventType: parsed?.eventType ?? "unknown",
    });
  } catch (e) {
    console.error("[POST /api/webhooks/axisrooms]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
