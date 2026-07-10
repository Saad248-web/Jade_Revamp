import { connectDB } from "@/lib/db";
import { VillaModel } from "@/models/Villa";
import { villaAxisRoomsMapping } from "./mapBooking";

export type AxisRoomsCsvRow = {
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  ratePlanId: string;
  ratePlanName: string;
};

export async function listVillasForAxisCsv(): Promise<AxisRoomsCsvRow[]> {
  await connectDB();
  const villas = await VillaModel.find({ isDeleted: false })
    .sort({ name: 1 })
    .lean();

  return villas.map((v) => {
    const m = villaAxisRoomsMapping(v);
    return {
      hotelId: m.propertyId ?? "",
      hotelName: v.name ?? v.slug,
      roomId: m.roomTypeId ?? "",
      roomName: v.shortName ?? v.name ?? v.slug,
      ratePlanId: m.ratePlanId ?? "BAR",
      ratePlanName: m.ratePlanName ?? "Best Available Rate",
    };
  });
}

export function axisCsvToString(rows: AxisRoomsCsvRow[]): string {
  const header =
    "hotelId,hotelName,roomId,roomName,ratePlanId,ratePlanName";
  const lines = rows.map(
    (r) =>
      `${csvEsc(r.hotelId)},${csvEsc(r.hotelName)},${csvEsc(r.roomId)},${csvEsc(r.roomName)},${csvEsc(r.ratePlanId)},${csvEsc(r.ratePlanName)}`,
  );
  return [header, ...lines].join("\n");
}

function csvEsc(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
