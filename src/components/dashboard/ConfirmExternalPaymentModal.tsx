"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import type { BookingRecord } from "@/lib/bookings/store";
import {
  EXTERNAL_PAYMENT_CHANNELS,
  type ExternalPaymentChannel,
} from "@/lib/bookings/confirmExternalPayment";
import { formatPaise } from "@/lib/money";
import {
  DashFormActionBar,
  DashFormShell,
} from "@/components/dashboard/form";
import { DashboardModalHeader } from "./ui/DashboardModalHeader";

type ConfirmExternalPaymentModalProps = {
  booking: BookingRecord;
  onClose: () => void;
  onSuccess: () => void;
};

export function ConfirmExternalPaymentModal({
  booking,
  onClose,
  onSuccess,
}: ConfirmExternalPaymentModalProps) {
  const isDepositPlan = booking.payment.paymentPlan === "deposit";
  const [paymentChannel, setPaymentChannel] =
    useState<ExternalPaymentChannel>("gpay");
  const [externalPaymentRef, setExternalPaymentRef] = useState("");
  const [fullAmountReceived, setFullAmountReceived] = useState(!isDepositPlan);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const amountLabel = isDepositPlan
    ? fullAmountReceived
      ? formatPaise(booking.pricing.totalPaise)
      : formatPaise(booking.payment.depositPaise)
    : formatPaise(booking.pricing.totalPaise);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await dashboardFetch(
        `/api/dashboard/bookings/${booking.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "confirm_payment",
            paymentChannel,
            externalPaymentRef: externalPaymentRef.trim() || undefined,
            fullAmountReceived: isDepositPlan ? fullAmountReceived : true,
          }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Confirmation failed");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-payment-title"
    >
      <div
        className={`${GLASS_CHROME_FRAME_CLASS} w-full max-w-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={GLASS_INNER_SURFACE}>
          <form onSubmit={handleSubmit} noValidate>
            <DashboardModalHeader
              titleId="confirm-payment-title"
              title="Confirm offline payment"
              description={`Mark ${amountLabel} as received and confirm this booking for ${booking.guestDetails.name}.`}
              onClose={onClose}
            />

            <DashFormShell>
              <div className="space-y-4">
                <div>
                  <label className={`${dash.label} mb-2 block`} htmlFor="pay-channel">
                    Payment method
                  </label>
                  <select
                    id="pay-channel"
                    className={`${dash.input} w-full`}
                    value={paymentChannel}
                    onChange={(e) =>
                      setPaymentChannel(e.target.value as ExternalPaymentChannel)
                    }
                  >
                    {EXTERNAL_PAYMENT_CHANNELS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`${dash.label} mb-2 block`} htmlFor="pay-ref">
                    Reference (optional)
                  </label>
                  <input
                    id="pay-ref"
                    className={`${dash.input} w-full`}
                    placeholder="UPI txn ID, bank ref, receipt #"
                    value={externalPaymentRef}
                    onChange={(e) => setExternalPaymentRef(e.target.value)}
                    maxLength={200}
                  />
                </div>

                {isDepositPlan && (
                  <label className="flex cursor-pointer items-start gap-3 rounded border border-white/10 p-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={fullAmountReceived}
                      onChange={(e) => setFullAmountReceived(e.target.checked)}
                    />
                    <span className="font-manrope text-sm text-white/80">
                      Full amount received offline (
                      {formatPaise(booking.pricing.totalPaise)})
                      <span className="mt-1 block text-white/50">
                        Unchecked confirms deposit only (
                        {formatPaise(booking.payment.depositPaise)}); balance due
                        before check-in.
                      </span>
                    </span>
                  </label>
                )}

                <p className="font-manrope text-sm text-white/55">
                  The guest will receive a confirmation email. This action is
                  logged for audit and OTA inventory will be blocked.
                </p>

                {error && (
                  <p className="font-manrope text-sm text-red-300" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <DashFormActionBar>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="min-h-[44px] border border-white/20 px-4 py-2 font-manrope text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] items-center gap-2 border border-emerald-400/40 px-4 py-2 font-manrope text-xs font-bold uppercase tracking-widest text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Confirming…
                    </>
                  ) : (
                    "Confirm payment"
                  )}
                </button>
              </DashFormActionBar>
            </DashFormShell>
          </form>
        </div>
      </div>
    </div>
  );
}
