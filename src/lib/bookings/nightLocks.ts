import { connectDB, mongoose } from "@/lib/db";
import type { ClientSession, Types } from "mongoose";

export async function acquireNightLocks(params: {
  villaId: Types.ObjectId;
  bookingId: Types.ObjectId;
  dates: string[];
  session: ClientSession;
}): Promise<{ ok: true } | { ok: false; conflictDate: string }> {
  const { VillaNightlockModel } = await import("@/models/VillaNightlock");

  for (const date of params.dates) {
    try {
      await VillaNightlockModel.create(
        [
          {
            villaId: params.villaId,
            date,
            bookingId: params.bookingId,
          },
        ],
        { session: params.session },
      );
    } catch (e: unknown) {
      const err = e as { code?: number };
      if (err.code === 11000) {
        return { ok: false, conflictDate: date };
      }
      throw e;
    }
  }
  return { ok: true };
}

export async function releaseNightLocks(
  bookingId: Types.ObjectId,
  session?: ClientSession,
): Promise<void> {
  const { VillaNightlockModel } = await import("@/models/VillaNightlock");
  await VillaNightlockModel.deleteMany({ bookingId }, { session });
}

export async function withTransaction<T>(
  fn: (session: ClientSession) => Promise<T>,
): Promise<T> {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}
