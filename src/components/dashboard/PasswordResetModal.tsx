"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardModalHeader } from "./ui/DashboardModalHeader";

const inputClass =
  "w-full border border-white/15 bg-black/20 px-4 py-3 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[var(--dash-accent-border)] focus:outline-none";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[var(--dash-accent)]";

type PasswordResetModalProps = {
  userName: string;
  userEmail: string;
  onClose: () => void;
  onSubmit: (password: string) => Promise<string | null>;
};

export function PasswordResetModal({
  userName,
  userEmail,
  onClose,
  onSubmit,
}: PasswordResetModalProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSaving(true);
    const err = await onSubmit(password);
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className={dash.modalOverlay} onClick={onClose}>
      <div
        className={`${GLASS_CHROME_FRAME_CLASS} ${dash.modal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-px block ${GLASS_INNER_SURFACE}`}
        />
        <form onSubmit={handleSubmit} className={`${dash.modalFrame} flex min-h-0 flex-col`}>
          <DashboardModalHeader
            section="Staff"
            title="Reset password"
            description={`Set a new password for ${userName} (${userEmail})`}
            onClose={onClose}
          />
          <div className={`${dash.modalBody} ${dash.stack}`}>          <div>
            <label className={labelClass} htmlFor="pr-password">
              New password
            </label>
            <input
              id="pr-password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="pr-confirm">
              Confirm password
            </label>
            <input
              id="pr-confirm"
              type="password"
              className={inputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          {error && (
            <p className="font-manrope text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`${dash.btn} ${dash.btnAccent} w-full`}
          >
            {saving ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              "Update password"
            )}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
