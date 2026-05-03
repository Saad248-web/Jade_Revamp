import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getClientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { notifyCareerApplication } from "@/lib/email/careerNotifications";

export const dynamic = "force-dynamic";

const MAX_RESUME_BYTES = 4 * 1024 * 1024; // 4 MB

function normalizeEmail(s: string): string | null {
  const v = s.trim().toLowerCase();
  if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return null;
  return v;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? getClientIpFromHeaders(req.headers);
    const rl = rateLimit({
      key: `careers:apply:${ip}`,
      limit: 8,
      windowMs: 60 * 60 * 1000,
    });
    if (!rl.ok) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many applications from this connection. Try later.",
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

    const formData = await req.formData();

    const jobId = String(formData.get("jobId") ?? "").trim().slice(0, 120);
    const fullName = String(formData.get("fullName") ?? "").trim().slice(0, 200);
    const email = normalizeEmail(String(formData.get("email") ?? ""));
    const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
    const company = String(formData.get("company") ?? "").trim().slice(0, 200);

    if (!jobId || !fullName || !email) {
      return NextResponse.json(
        { error: "jobId, fullName, and a valid email are required" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const resume = formData.get("resume");
    let resumeFilename: string | null = null;
    let resumeMime: string | null = null;
    let resumeBuf: Buffer | null = null;

    if (resume instanceof File && resume.size > 0) {
      if (resume.size > MAX_RESUME_BYTES) {
        return NextResponse.json(
          {
            error: `Résumé must be smaller than ${MAX_RESUME_BYTES / (1024 * 1024)} MB`,
          },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }
      const ab = await resume.arrayBuffer();
      resumeBuf = Buffer.from(ab);
      resumeFilename = resume.name.slice(0, 260);
      resumeMime = resume.type.slice(0, 120) || "application/octet-stream";
    }

    const result = await query<{ id: string }>(
      `INSERT INTO career_applications
         (job_id, full_name, email, phone, company,
          resume_filename, resume_mime, resume_bytes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        jobId,
        fullName,
        email,
        phone,
        company,
        resumeFilename,
        resumeMime,
        resumeBuf,
      ],
    );

    const row = result.rows[0];
    if (!row?.id) {
      return NextResponse.json(
        { error: "Unable to save application" },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    await notifyCareerApplication({
      jobId,
      applicantName: fullName,
      applicantEmail: email,
      applicationId: row.id,
    });

    return NextResponse.json(
      { ok: true, applicationId: row.id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[POST /api/careers/apply]", err);
    return NextResponse.json(
      { error: "Unable to submit application. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
