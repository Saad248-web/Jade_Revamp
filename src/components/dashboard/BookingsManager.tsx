"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatBookingSource } from "@/lib/bookings/sourceLabels";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { formatPaise } from "@/lib/money";
import { DataTable, type DataTableColumn } from "./DataTable";
import { DashboardListToolbar } from "./ui/DashboardListToolbar";
import { DashboardModuleFrame } from "./ui/DashboardModuleFrame";

export type BookingListRow = {
  id: string;
  bookingToken: string;
  villaName: string;
  villaSlug: string | null;
  guestName: string;
  guestEmail: string | null;
  checkIn: string;
  checkOut: string;
  status: string;
  source: string;
  paymentStatus: string;
  totalPaise: number;
  axisRoomsReservationId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const STATUS_STYLE: Record<string, string> = {
  confirmed: "text-emerald-300",
  on_hold: "text-violet-300",
  pending: "text-amber-300",
  conflict: "text-red-300",
  cancelled: "text-white/40",
  expired: "text-white/40",
};

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "on_hold", label: "On hold" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "conflict", label: "Conflict" },
] as const;

const SOURCE_FILTERS = [
  { value: "", label: "All channels" },
  { value: "website", label: "Direct" },
  { value: "admin_manual", label: "Staff manual" },
  { value: "axisrooms_airbnb", label: "Airbnb OTA" },
  { value: "axisrooms_booking_com", label: "Booking.com OTA" },
] as const;

function fmtDate(dateStr: string): string {
  return new Date(`${dateStr.split("T")[0]}T00:00:00.000Z`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
  );
}

function fmtWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingsManager() {
  const [rows, setRows] = useState<BookingListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      const qs = params.toString();
      const res = await dashboardFetch(
        `/api/dashboard/bookings${qs ? `?${qs}` : ""}`,
      );
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = (await res.json()) as { bookings?: BookingListRow[] };
      setRows(data.bookings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: DataTableColumn<BookingListRow>[] = useMemo(
    () => [
      {
        key: "guest",
        header: "Guest / Villa",
        cell: (r) => (
          <div className="min-w-0">
            <p className="truncate font-bold text-white">{r.guestName}</p>
            <p className="truncate text-sm text-white/45">{r.villaName}</p>
          </div>
        ),
      },
      {
        key: "dates",
        header: "Stay",
        cell: (r) => (
          <span className="font-manrope text-sm text-white/75">
            {fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}
          </span>
        ),
      },
      {
        key: "channel",
        header: "Channel",
        cell: (r) => (
          <span className="font-manrope text-xs font-bold uppercase tracking-widest text-white/55">
            {formatBookingSource(r.source).shortLabel}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <span
            className={`text-xs font-bold uppercase tracking-widest ${STATUS_STYLE[r.status] ?? "text-white/50"}`}
          >
            {r.status.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "total",
        header: "Total",
        cell: (r) => (
          <span className="font-philosopher text-base text-white">
            {formatPaise(r.totalPaise)}
          </span>
        ),
      },
      {
        key: "folio",
        header: "",
        cell: (r) => (
          <Link
            href={`/dashboard/bookings/${r.id}`}
            className="inline-flex min-h-[44px] items-center gap-1.5 font-manrope text-xs font-bold uppercase tracking-widest text-[var(--dash-accent)] hover:underline"
          >
            Open folio
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <DashboardModuleFrame
      toolbar={
        <DashboardListToolbar
          meta={
            <span className="font-manrope text-sm text-white/55">
              {rows.length} booking{rows.length === 1 ? "" : "s"}
              {statusFilter || sourceFilter ? " (filtered)" : ""}
            </span>
          }
          onRefresh={load}
          refreshing={loading}
        />
      }
      error={error}
      loading={loading}
      loadingLabel="Loading booking records…"
    >
      <div className={`${dash.stack} mb-4`}>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value || "all-status"}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`min-h-[36px] border px-3 py-1.5 font-manrope text-xs font-bold uppercase tracking-widest transition-colors ${
                statusFilter === f.value
                  ? "border-[var(--dash-accent-border)] bg-[var(--dash-accent-muted)] text-[var(--dash-accent)]"
                  : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f.value || "all-source"}
              type="button"
              onClick={() => setSourceFilter(f.value)}
              className={`min-h-[36px] border px-3 py-1.5 font-manrope text-xs font-bold uppercase tracking-widest transition-colors ${
                sourceFilter === f.value
                  ? "border-[var(--dash-accent-border)] bg-[var(--dash-accent-muted)] text-[var(--dash-accent)]"
                  : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyMessage="No bookings match these filters."
        caption="Booking records — direct, staff, and OTA"
        stickyFirstColumn
        dense
      />
      {!loading && rows.length > 0 && (
        <p className="mt-3 font-manrope text-xs text-white/40">
          Last updated {fmtWhen(rows[0]?.updatedAt ?? null)} on most recent row.
          Open any row for full folio and activity history.
        </p>
      )}
    </DashboardModuleFrame>
  );
}
