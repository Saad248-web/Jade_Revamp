"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { nightCount } from "@/lib/bookingDates";
import type { BookingRecord } from "@/lib/bookings/store";
import { useSession } from "next-auth/react";
import { roleCanWrite, type Role } from "@/lib/auth/permissions";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { formatPaise } from "@/lib/money";
import { DashboardPanel } from "./DashboardPanel";
import { EmptyState } from "./EmptyState";
import { DashboardModuleFrame } from "./ui/DashboardModuleFrame";

const STATUS_BADGE: Record<string, string> = {
  confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  conflict: "border-red-500/30 bg-red-500/10 text-red-300",
  cancelled: "border-white/20 bg-white/5 text-white/50",
  expired: "border-white/20 bg-white/5 text-white/50",
};

function fmtDate(dateStr: string): string {
  const d = new Date(`${dateStr.split("T")[0]}T00:00:00.000Z`);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

type BookingFolioProps = {
  bookingId: string;
};

function FolioSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <DashboardPanel pad className="h-full w-full">
      <h2 className={`${dash.label} mb-4`}>{title}</h2>
      {children}
    </DashboardPanel>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-white/5 py-3 last:border-0">
      <dt className="font-manrope text-[length:var(--fs-label)] uppercase tracking-widest text-white/40">
        {label}
      </dt>
      <dd className="font-manrope text-[length:var(--fs-body)] text-white/85 break-words">
        {value}
      </dd>
    </div>
  );
}

export function BookingFolio({ bookingId }: BookingFolioProps) {
  const { data: session } = useSession();
  const role = session?.user?.role as Role | undefined;
  const canWrite = role ? roleCanWrite("/dashboard/bookings", role) : false;

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await dashboardFetch(`/api/bookings/${bookingId}`);
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Booking not found");
      }
      const data = (await res.json()) as { booking: BookingRecord };
      setBooking(data.booking);
      setNotesDraft((data.booking as { notes?: string }).notes ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load booking");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const runAction = async (
    body: Record<string, unknown>,
    confirmMsg: string,
  ) => {
    if (!window.confirm(confirmMsg)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await dashboardFetch(`/api/dashboard/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Action failed");
      await fetchBooking();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#EFCD62]" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <EmptyState
        title="Booking unavailable"
        description={error ?? "This folio could not be loaded."}
        action={
          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#EFCD62]/40 px-5 py-2 font-manrope text-xs font-bold uppercase tracking-widest text-[#EFCD62] transition-colors hover:bg-[#EFCD62]/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to calendar
          </Link>
        }
      />
    );
  }

  const nights = nightCount(booking.checkIn, booking.checkOut);
  const badge =
    STATUS_BADGE[booking.status] ??
    "border-white/20 bg-white/5 text-white/60";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex min-h-[44px] items-center gap-2 font-manrope text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Calendar
        </Link>
        <span
          className={`inline-flex items-center rounded-none border px-3 py-1 font-manrope text-xs font-bold uppercase tracking-widest ${badge}`}
        >
          {booking.status}
        </span>
      </div>

      {canWrite && booking.status !== "cancelled" && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runAction({ action: "cancel" }, "Cancel this booking?")
            }
            className="min-h-[44px] border border-red-400/40 px-4 py-2 font-manrope text-xs font-bold uppercase tracking-widest text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            Cancel
          </button>
          {(booking.payment.status === "paid" ||
            booking.payment.status === "deposit_paid") && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                runAction(
                  { action: "refund", reason: "staff_manual" },
                  "Issue full Razorpay refund?",
                )
              }
              className="min-h-[44px] border border-amber-400/40 px-4 py-2 font-manrope text-xs font-bold uppercase tracking-widest text-amber-200 hover:bg-amber-500/10 disabled:opacity-50"
            >
              Refund
            </button>
          )}
        </div>
      )}

      {canWrite && (
        <DashboardPanel pad>
          <label className={`${dash.label} mb-2 block`}>Staff notes</label>
          <textarea
            className={`${dash.input} min-h-[80px] w-full`}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction({ action: "notes", notes: notesDraft }, "Save notes?")}
            className="mt-3 min-h-[44px] border border-[#EFCD62]/40 px-4 py-2 font-manrope text-xs font-bold uppercase tracking-widest text-[#EFCD62] hover:bg-[#EFCD62]/10 disabled:opacity-50"
          >
            Save notes
          </button>
        </DashboardPanel>
      )}

      {error && (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <FolioSection title="Guest">
          <dl>
            <DetailRow
              label="Name"
              value={
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4 text-[#EFCD62]" aria-hidden />
                  {booking.guestDetails.name}
                </span>
              }
            />
            <DetailRow
              label="Email"
              value={
                <a
                  href={`mailto:${booking.guestDetails.email}`}
                  className="inline-flex items-center gap-2 text-[#EFCD62] hover:underline"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  {booking.guestDetails.email}
                </a>
              }
            />
            <DetailRow
              label="Phone"
              value={
                <a
                  href={`tel:${booking.guestDetails.phone}`}
                  className="inline-flex items-center gap-2 text-[#EFCD62] hover:underline"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {booking.guestDetails.phone}
                </a>
              }
            />
            <DetailRow label="Guests" value={booking.guests} />
            {booking.stayStatus && (
              <DetailRow label="Stay status" value={booking.stayStatus} />
            )}
          </dl>
        </FolioSection>

        <FolioSection title="Stay">
          <dl>
            <DetailRow
              label="Villa"
              value={booking.villaSlug ?? booking.villaId}
            />
            <DetailRow label="Type" value={booking.bookingType} />
            <DetailRow
              label="Dates"
              value={
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#EFCD62]" aria-hidden />
                  {fmtDate(booking.checkIn)} → {fmtDate(booking.checkOut)} (
                  {nights} night{nights === 1 ? "" : "s"})
                </span>
              }
            />
            <DetailRow label="Booking ID" value={booking.id} />
          </dl>
        </FolioSection>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FolioSection title="Pricing">
          <dl>
            <DetailRow
              label="Base"
              value={formatPaise(booking.pricing.basePaise)}
            />
            {booking.pricing.extraPaxPaise > 0 && (
              <DetailRow
                label="Extra guests"
                value={formatPaise(booking.pricing.extraPaxPaise)}
              />
            )}
            {booking.pricing.eventPaise > 0 && (
              <DetailRow
                label="Event"
                value={formatPaise(booking.pricing.eventPaise)}
              />
            )}
            {booking.pricing.addOnPaise > 0 && (
              <DetailRow
                label="Add-ons"
                value={formatPaise(booking.pricing.addOnPaise)}
              />
            )}
            <DetailRow
              label="GST"
              value={formatPaise(booking.pricing.taxPaise)}
            />
            <DetailRow
              label="Total"
              value={
                <span className="font-philosopher text-xl text-[#EFCD62]">
                  {formatPaise(booking.pricing.totalPaise)}
                </span>
              }
            />
          </dl>
        </FolioSection>

        <FolioSection title="Payment">
          <dl>
            <DetailRow
              label="Status"
              value={
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#EFCD62]" aria-hidden />
                  {booking.payment.status}
                </span>
              }
            />
            <DetailRow
              label="Plan"
              value={booking.payment.paymentPlan}
            />
            <DetailRow
              label="Amount due"
              value={formatPaise(booking.payment.amountDuePaise)}
            />
            <DetailRow
              label="Deposit"
              value={formatPaise(booking.payment.depositPaise)}
            />
            {booking.payment.orderId && (
              <DetailRow
                label="Razorpay order"
                value={
                  <span className="break-all font-mono text-sm">
                    {booking.payment.orderId}
                  </span>
                }
              />
            )}
            {booking.payment.paymentId && (
              <DetailRow
                label="Razorpay payment"
                value={
                  <span className="break-all font-mono text-sm">
                    {booking.payment.paymentId}
                  </span>
                }
              />
            )}
          </dl>
        </FolioSection>
      </div>
    </div>
  );
}
