import { NextRequest, NextResponse } from "next/server";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { readJsonBody, SafeJsonError } from "@/lib/security/safeJson";
import { notifyNewLead } from "@/lib/email/leadsNotifications";

export const dynamic = "force-dynamic";

const MAX_JSON = 56 * 1024;

const SOURCES_GENERAL_LIKE = new Set([
  "general_enquiry",
  "weekend_getaways_enquiry",
  "rathaa_enquiry",
] as const);

function normalizeEmail(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const v = s.trim().toLowerCase();
  if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return null;
  return v;
}

function phoneDigits(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.replace(/\D/g, "");
}

function hasContactName(s: unknown): boolean {
  return typeof s === "string" && s.trim().length >= 2;
}

function hasValidPhone(s: unknown): boolean {
  return phoneDigits(s).length >= 10;
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
      source !== "weekend_getaways_enquiry" &&
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

    if (
      SOURCES_GENERAL_LIKE.has(
        source as
          | "general_enquiry"
          | "weekend_getaways_enquiry"
          | "rathaa_enquiry",
      )
    ) {
      const p = b.payload;
      if (p === null || typeof p !== "object") {
        return NextResponse.json(
          { error: "payload required" },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }
      const o = p as Record<string, unknown>;
      email = normalizeEmail(o.email);

      if (source === "rathaa_enquiry") {
        if (!email) {
          return NextResponse.json(
            { error: "Valid email required" },
            { status: 400, headers: { "Cache-Control": "no-store" } },
          );
        }
      } else {
        const phoneOk = hasValidPhone(o.phoneNumber);
        const nameOk = hasContactName(o.fullName);
        if (!email && !(phoneOk && nameOk)) {
          const partialEmail =
            typeof o.email === "string" && o.email.trim().length > 0;
          return NextResponse.json(
            {
              error: partialEmail
                ? "Valid email required"
                : "Name and a valid phone number are required",
            },
            { status: 400, headers: { "Cache-Control": "no-store" } },
          );
        }
      }

      const sourceLabel =
        source === "rathaa_enquiry"
          ? "Rathaa / caravan overlay"
          : source === "weekend_getaways_enquiry"
            ? "Weekend getaways page"
            : "General enquiry (site overlay)";

      preview = [
        `Source: ${source} (${sourceLabel})`,
        `Name: ${String(o.fullName ?? "").slice(0, 200)}`,
        `Email: ${email ?? "(not provided)"}`,
        `Phone: ${String(o.phoneNumber ?? "").slice(0, 40)}`,
        `Guests: ${String(o.guests ?? "").slice(0, 80)}`,
        `Preferred date: ${String(o.preferredDate ?? "").slice(0, 120)}`,
        `Interests: ${JSON.stringify(o.travelFormat ?? {})}`,
        `Occasion: ${String(o.occasionType ?? o.occasion ?? "").slice(0, 200)}`,
        `Special requests: ${String(o.specialRequests ?? "").slice(0, 2000)}`,
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

    const { connectDB } = await import("@/lib/db");
    const { LeadModel } = await import("@/models/Lead");
    const { auditLog } = await import("@/lib/audit/auditLog");

    await connectDB();
    const doc = await LeadModel.create({
      source,
      payload: b.payload ?? {},
      email,
    });

    await auditLog({
      action: "lead.create",
      targetType: "lead",
      targetId: String(doc._id),
      ip,
    });

    const id = String(doc._id);
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
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: unknown }).code)
        : "";
    const devDbHint =
      process.env.NODE_ENV !== "production" && code === "ECONNREFUSED"
        ? "Database is not running. Set MONGODB_URI in .env.local — see NEEDS_FROM_USER.md."
        : null;
    return NextResponse.json(
      {
        error:
          devDbHint ??
          "Unable to save your enquiry. Please try again or contact us directly.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
