import type { NextRequest } from "next/server";
import { timingSafeStringEqual } from "@/lib/security/timingSafe";

export type AdminAuthResult = "ok" | "missing_config" | "unauthorized";

/** Compares `x-admin-password` to `ADMIN_PASSWORD` in constant time. */
export function verifyAdminPassword(req: NextRequest): AdminAuthResult {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (!configured) {
    return "missing_config";
  }
  const provided = req.headers.get("x-admin-password") ?? "";
  if (!timingSafeStringEqual(provided, configured)) {
    return "unauthorized";
  }
  return "ok";
}
