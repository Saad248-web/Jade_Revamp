import { connectDB } from "@/lib/db";
import { SeoRedirectModel } from "@/models/SeoRedirect";

export type RedirectTestStatus = "active" | "broken" | "conflict" | "loop" | "untested";

function normalizePath(path: string): string {
  const p = path.trim();
  if (!p) return "/";
  return p.startsWith("/") ? p.replace(/\/+$/, "") || "/" : `/${p.replace(/\/+$/, "")}`;
}

export function testRedirect(
  fromPath: string,
  toPath: string,
  allRedirects: { fromPath: string; toPath: string }[] = [],
): { status: RedirectTestStatus; message?: string } {
  const from = normalizePath(fromPath);
  const to = normalizePath(toPath);

  if (!to || to === from) {
    return { status: "broken", message: "Invalid target" };
  }

  const conflicts = allRedirects.filter(
    (r) => normalizePath(r.fromPath) === from && normalizePath(r.toPath) !== to,
  );
  if (conflicts.length > 1) {
    return { status: "conflict", message: "Multiple targets for same source" };
  }

  const visited = new Set<string>([from]);
  let current = to;
  for (let i = 0; i < 10; i++) {
    const next = allRedirects.find((r) => normalizePath(r.fromPath) === current);
    if (!next) break;
    current = normalizePath(next.toPath);
    if (visited.has(current)) {
      return { status: "loop", message: "Redirect chain loops" };
    }
    visited.add(current);
  }

  return { status: "active" };
}

export async function listRedirects() {
  await connectDB();
  const rows = await SeoRedirectModel.find().sort({ fromPath: 1 }).lean();
  const all = rows.map((r) => ({
    fromPath: (r as { fromPath: string }).fromPath,
    toPath: (r as { toPath: string }).toPath,
  }));

  return rows.map((r) => {
    const row = r as {
      _id: { toString(): string };
      fromPath: string;
      toPath: string;
      type: string;
      status: string;
      testStatus?: string;
      lastTestedAt?: Date;
      note?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
    const test = testRedirect(row.fromPath, row.toPath, all);
    return {
      ...row,
      _id: row._id.toString(),
      testStatus: test.status,
      testMessage: test.message,
    };
  });
}

export async function createRedirect(input: {
  fromPath: string;
  toPath: string;
  type?: "301" | "302";
  note?: string;
  userId: string;
}) {
  await connectDB();
  const fromPath = normalizePath(input.fromPath);
  const toPath = normalizePath(input.toPath);

  const existing = await SeoRedirectModel.findOne({ fromPath });
  if (existing) {
    throw new Error("A redirect already exists for this path");
  }

  const all = await SeoRedirectModel.find({ status: "active" })
    .select("fromPath toPath")
    .lean();
  const test = testRedirect(fromPath, toPath, all as { fromPath: string; toPath: string }[]);
  if (test.status === "loop") {
    throw new Error("This redirect would create a loop");
  }

  return SeoRedirectModel.create({
    fromPath,
    toPath,
    type: input.type ?? "301",
    note: input.note,
    testStatus: test.status,
    lastTestedAt: new Date(),
    createdBy: input.userId,
    updatedBy: input.userId,
  });
}

export async function updateRedirect(
  id: string,
  input: Partial<{
    toPath: string;
    type: "301" | "302";
    status: "active" | "disabled";
    note: string;
  }>,
  userId: string,
) {
  await connectDB();
  const update: Record<string, unknown> = { ...input, updatedBy: userId };
  if (input.toPath) update.toPath = normalizePath(input.toPath);
  return SeoRedirectModel.findByIdAndUpdate(id, update, { new: true });
}

export async function deleteRedirect(id: string) {
  await connectDB();
  return SeoRedirectModel.findByIdAndDelete(id);
}

export async function resolveRedirectPath(pathname: string): Promise<{
  toPath: string;
  type: "301" | "302";
} | null> {
  await connectDB();
  const fromPath = normalizePath(pathname);
  const row = await SeoRedirectModel.findOne({ fromPath, status: "active" }).lean();
  if (!row) return null;
  return {
    toPath: (row as { toPath: string }).toPath,
    type: ((row as { type?: string }).type as "301" | "302") ?? "301",
  };
}

export async function suggestRedirectFromSlugChange(
  oldSlug: string,
  newSlug: string,
  contentType: "blog" | "villa" = "blog",
) {
  const base = contentType === "blog" ? "/blogs" : "/villas";
  return {
    fromPath: `${base}/${oldSlug}`,
    toPath: `${base}/${newSlug}`,
    type: "301" as const,
  };
}
