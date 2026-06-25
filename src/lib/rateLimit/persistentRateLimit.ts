import { connectDB } from "@/lib/db";
import { RateLimitBucketModel } from "@/models/RateLimitBucket";

type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number; remaining: 0 };

export async function persistentRateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
}): Promise<RateLimitResult> {
  const now = params.now ?? Date.now();
  try {
    await connectDB();
  } catch {
    // Fallback: allow if Mongo unavailable (degraded)
    return { ok: true, remaining: params.limit };
  }

  const resetAt = new Date(now + params.windowMs);
  const existing = await RateLimitBucketModel.findOne({ key: params.key });

  if (!existing || existing.resetAt.getTime() <= now) {
    await RateLimitBucketModel.findOneAndUpdate(
      { key: params.key },
      { resetAt, count: 1 },
      { upsert: true },
    );
    return { ok: true, remaining: Math.max(0, params.limit - 1) };
  }

  if (existing.count >= params.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt.getTime() - now) / 1000),
    );
    return { ok: false, retryAfterSeconds, remaining: 0 };
  }

  existing.count += 1;
  await existing.save();
  return { ok: true, remaining: Math.max(0, params.limit - existing.count) };
}
