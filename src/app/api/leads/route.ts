import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { readJsonBody, SafeJsonError } from "@/lib/security/safeJson";
import { notifyNewLead } from "@/lib/email/leadsNotifications";

export const dynamic = "force-dynamic";

const MAX_JSON = 56 * 1024;

const SOURCES_GENERAL_LIKE = new Set([
  "general_enquiry",
  "rathaa_enquiry",
] as const);

function normalizeEmail(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const v = s.trim().toLowerCase();
  if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return null;
  return v;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? getClientIpFromHeaders(req.headers);
    const rl = rateLimit({
      key: `leads:post:${ip}`,
      limit: 20,
      windowMs: 60 * 60 * 1000,
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

    let body: unknown;
    try {
      body = await readJsonBody(req, MAX_JSON);
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
    const source = b.source;

    if (
      source !== "general_enquiry" &&
      source !== "rathaa_enquiry" &&
      source !== "wedding_enquiry"
    ) {
      return NextResponse.json(
        { error: "Invalid source" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    let email: string | null = null;
    let preview = "";

    if (SOURCES_GENERAL_LIKE.has(source as "general_enquiry" | "rathaa_enquiry")) {
      const p = b.payload;
      if (p === null || typeof p !== "object") {
        return NextResponse.json(
          { error: "payload required" },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }
      const o = p as Record<string, unknown>;
      email = normalizeEmail(o.email);
      if (!email) {
        return NextResponse.json(
          { error: "Valid email required" },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }

      const sourceLabel =
        source === "rathaa_enquiry"
          ? "Rathaa / caravan overlay"
          : "General enquiry (site overlay)";

      preview = [
        `Source: ${source} (${sourceLabel})`,
        `Name: ${String(o.fullName ?? "").slice(0, 200)}`,
        `Email: ${email}`,
        `Phone: ${String(o.phoneNumber ?? "").slice(0, 40)}`,
        `Guests: ${String(o.guests ?? "").slice(0, 80)}`,
        `Preferred date: ${String(o.preferredDate ?? "").slice(0, 120)}`,
        `Interests: ${JSON.stringify(o.travelFormat ?? {})}`,
        `Occasion / notes: ${String(o.occasion ?? "").slice(0, 2000)}`,
      ].join("\n");
    } else {
      const p = b.payload;
      if (p === null || typeof p !== "object") {
        return NextResponse.json(
          { error: "payload required" },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }
      const o = p as Record<string, unknown>;
      email = normalizeEmail(o.email);
      if (!email) {
        return NextResponse.json(
          { error: "Valid email required" },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }

      preview = [
        `Source: wedding_enquiry`,
        `Name: ${String(o.fullName ?? "").slice(0, 200)}`,
        `Email: ${email}`,
        `Phone: ${String(o.phone ?? "").slice(0, 40)}`,
        `Event date: ${String(o.eventDate ?? "").slice(0, 40)}`,
        `Services: ${JSON.stringify(o.services ?? [])}`,
        `Events: ${JSON.stringify(o.events ?? [])}`,
        `Setting: ${JSON.stringify(o.setting ?? [])}`,
        `Notes: ${String(o.notes ?? "").slice(0, 2000)}`,
      ].join("\n");
    }

    const result = await query<{ id: string }>(
      `INSERT INTO leads (source, payload, email)
       VALUES ($1, $2::jsonb, $3)
       RETURNING id`,
      [source as string, JSON.stringify(b.payload ?? {}), email],
    );

    const id = result.rows[0]?.id;
    await notifyNewLead({
      source,
      preview: `${preview}\n\nLead row id: ${id ?? "(unknown)"}`,
    });

    return NextResponse.json(
      { ok: true, leadId: id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json(
      {
        error:
          "Unable to save your enquiry. Please try again or contact us directly.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
