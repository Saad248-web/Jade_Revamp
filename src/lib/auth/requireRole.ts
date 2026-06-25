import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Role } from "./permissions";
import { canAccess } from "./permissions";
import { authOptions } from "./authOptions";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export type RequireRoleSuccess = {
  ok: true;
  role: Role;
  userId: string;
  name: string;
  email: string;
  assignedVillas: string[];
};

type RequireRoleFailure = { ok: false; response: NextResponse };

const noStore = { "Cache-Control": "no-store" } as const;

/**
 * Authoritative server-side RBAC guard.
 *
 * - Requires a valid NextAuth session (no header/password bypass).
 * - Re-reads the user from MongoDB on every call (source of truth), so a
 *   revoked/suspended/deleted account is denied immediately, not at token expiry.
 * - Enforces the route permission matrix at the requested access level.
 */
export async function requireRole(
  req: NextRequest,
  path: string,
  min: "read" | "write" = "write",
): Promise<RequireRoleSuccess | RequireRoleFailure> {
  void req;
  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: noStore },
      ),
    };
  }

  let user;
  try {
    await connectDB();
    user = await UserModel.findOne({
      _id: sessionUserId,
      isDeleted: false,
    }).lean<{
      _id: unknown;
      name: string;
      email: string;
      role: Role;
      status: string;
      assignedVillas?: unknown[];
    }>();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authorization check failed" },
        { status: 503, headers: noStore },
      ),
    };
  }

  if (!user || user.status === "suspended") {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Account is no longer active",
          code: "ACCOUNT_SUSPENDED",
        },
        { status: 401, headers: noStore },
      ),
    };
  }

  const role = user.role;
  const level = canAccess(path, role);
  const allowed =
    min === "write" ? level === "write" : level === "read" || level === "write";

  if (!allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403, headers: noStore },
      ),
    };
  }

  return {
    ok: true,
    role,
    userId: String(user._id),
    name: user.name,
    email: user.email,
    assignedVillas: (user.assignedVillas ?? []).map(String),
  };
}
