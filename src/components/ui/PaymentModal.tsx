"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
  onFailure: (reason: string) => void;
  amount: number;
  villaName?: string;
  referenceId: string;
  status: "idle" | "processing" | "success" | "failed";
  onConfirm: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
  amount,
  villaName,
  referenceId,
  status,
  onConfirm,
}: PaymentModalProps) {
  const formatRupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="payment-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === "processing" ? undefined : onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
          />

          {/* Modal */}
          <motion.div
            key="payment-modal"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[80] bg-[#0D4032] border-t border-white/10 rounded-t-2xl overflow-hidden max-h-[90svh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h3 className="text-white font-philosopher text-gh-h2">
                {status === "success"
                  ? "Booking Confirmed"
                  : status === "failed"
                    ? "Payment Failed"
                    : "Confirm Payment"}
              </h3>
              {status !== "processing" && (
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Close payment modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Success State */}
              {status === "success" && (
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <CheckCircle
                    className="w-16 h-16 text-jade-gold"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-white font-philosopher text-gh-h3 mb-1">
                      Your booking is confirmed!
                    </p>
                    <p className="text-white/60 font-manrope text-gh-desc">
                      Reference:{" "}
                      <span className="text-jade-gold font-bold">
                        {referenceId}
                      </span>
                    </p>
                  </div>
                  <p className="text-white/50 font-manrope text-gh-label">
                    Our team will reach out within 2 hours to finalise your
                    stay.
                  </p>
                </div>
              )}

              {/* Failed State */}
              {status === "failed" && (
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <AlertCircle
                    className="w-16 h-16 text-red-400"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-white font-philosopher text-gh-h3 mb-1">
                      Payment could not be processed
                    </p>
                    <p className="text-white/60 font-manrope text-gh-desc">
                      Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              )}

              {/* Idle / Processing State */}
              {(status === "idle" || status === "processing") && (
                <>
                  {/* Booking Summary */}
                  <div className="bg-white/5 border border-white/10 p-4 space-y-2">
                    {villaName && (
                      <div className="flex justify-between text-gh-desc font-manrope">
                        <span className="text-white/60">Villa</span>
                        <span className="text-white font-bold">
                          {villaName}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-gh-desc font-manrope">
                      <span className="text-white/60">Reference</span>
                      <span className="text-jade-gold font-bold text-gh-label tracking-wider">
                        {referenceId}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                      <span className="text-white font-manrope font-bold text-gh-body">
                        Total
                      </span>
                      <span className="text-jade-gold font-philosopher text-gh-h3">
                        {formatRupees(amount)}
                      </span>
                    </div>
                  </div>

                  {/* Mock Payment Methods */}
                  <div className="space-y-2">
                    <p className="text-white/40 font-manrope text-gh-label uppercase tracking-widest">
                      Payment Method
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {["UPI / QR", "Credit / Debit Card"].map((method) => (
                        <div
                          key={method}
                          className="border border-jade-gold/30 bg-jade-gold/5 p-3 text-center font-manrope text-gh-label text-white/70 rounded-sm cursor-pointer hover:border-jade-gold hover:text-white transition-colors"
                        >
                          {method}
                        </div>
                      ))}
                    </div>
                    <p className="text-white/30 font-manrope text-gh-label text-center pt-1">
                      Payment gateway integration coming soon. This is a booking
                      request.
                    </p>
                  </div>

                  {/* Security note */}
                  <p className="text-white/30 font-manrope text-gh-label text-center flex items-center justify-center gap-1">
                    <span>🔒</span> Your data is encrypted and secure
                  </p>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 pb-8 pt-2">
              {status === "idle" && (
                <button
                  onClick={onConfirm}
                  className="w-full bg-jade-gold text-[#0D4032] font-manrope font-bold text-gh-label tracking-widest uppercase py-4 hover:bg-white transition-colors"
                >
                  CONFIRM BOOKING REQUEST
                </button>
              )}
              {status === "processing" && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <Loader2 className="w-5 h-5 text-jade-gold animate-spin" />
                  <span className="text-white/70 font-manrope text-gh-body">
                    Processing your request...
                  </span>
                </div>
              )}
              {status === "success" && (
                <button
                  onClick={onClose}
                  className="w-full bg-jade-gold text-[#0D4032] font-manrope font-bold text-gh-label tracking-widest uppercase py-4 hover:bg-white transition-colors"
                >
                  DONE
                </button>
              )}
              {status === "failed" && (
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 border border-white/20 text-white/60 font-manrope font-bold text-gh-label tracking-widest uppercase py-3 hover:border-white/50 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 bg-jade-gold text-[#0D4032] font-manrope font-bold text-gh-label tracking-widest uppercase py-3 hover:bg-white transition-colors"
                  >
                    RETRY
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
