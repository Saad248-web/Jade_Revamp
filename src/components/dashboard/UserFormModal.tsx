"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardModalHeader } from "./ui/DashboardModalHeader";
import { ALL_ROLES, ROLE_LABELS, type Role } from "@/lib/auth/permissions";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
};

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type UserFormModalProps = {
  mode: "create" | "edit";
  initial?: ManagedUser | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => Promise<string | null>;
};

const inputClass =
  "w-full border border-white/15 bg-black/20 px-4 py-3 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[var(--dash-accent-border)] focus:outline-none";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[var(--dash-accent)]";

export function UserFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(initial?.role ?? "staff");
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
    if (mode === "create" && password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (mode === "edit" && password) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    setSaving(true);
    const err = await onSubmit({ name, email, password, role });
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
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <DashboardModalHeader
            section="Staff"
            title={mode === "create" ? "Create user" : "Edit user"}
            onClose={onClose}
          />
          <div className={`${dash.modalBody} ${dash.stack}`}>
          <div>
            <label className={labelClass} htmlFor="uf-name">
              Full name
            </label>
            <input
              id="uf-name"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="uf-email">
              Email ID
            </label>
            <input
              id="uf-email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={mode === "edit"}
              placeholder="jane@jadehospitainment.com"
            />
            {mode === "edit" && (
              <p className="mt-1 font-manrope text-[length:var(--fs-desc)] text-white/35">
                Email cannot be changed after creation.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="uf-password">
              {mode === "create" ? "Password" : "New password (optional)"}
            </label>
            <input
              id="uf-password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === "create"}
              minLength={mode === "create" ? 8 : undefined}
              autoComplete={mode === "create" ? "new-password" : "off"}
              placeholder={mode === "create" ? "Min 8 characters" : "Leave blank to keep current"}
            />
          </div>

          {mode === "edit" && password.length > 0 && (
            <div>
              <label className={labelClass} htmlFor="uf-confirm">
                Confirm new password
              </label>
              <input
                id="uf-confirm"
                type="password"
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="uf-role">
              Role
            </label>
            <select
              id="uf-role"
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#1A1C1E]">
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="font-manrope text-[length:var(--fs-body)] text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className={`${dash.btn} ${dash.btnAccent} w-full`}
          >
            {saving ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : mode === "create" ? (
              "Create user"
            ) : (
              "Save changes"
            )}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
