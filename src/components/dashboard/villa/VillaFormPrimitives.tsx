"use client";

import type { ReactNode } from "react";
import { dash } from "@/lib/dashboard/dashboardClasses";

type VillaFormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  badge?: string;
};

/** Grouped card section for villa Quick Edit / Full Editor fields. */
export function VillaFormSection({
  title,
  description,
  children,
  badge,
}: VillaFormSectionProps) {
  return (
    <section className="villa-form-section">
      <div className="villa-form-section__head">
        <div>
          <h3 className="villa-form-section__title">{title}</h3>
          {description && (
            <p className="villa-form-section__desc">{description}</p>
          )}
        </div>
        {badge && <span className="villa-form-section__badge">{badge}</span>}
      </div>
      <div className="villa-form-section__body">{children}</div>
    </section>
  );
}

type VillaFormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function VillaFormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: VillaFormFieldProps) {
  return (
    <div className={className ?? "villa-form-field"}>
      <label htmlFor={htmlFor} className={dash.label}>
        {label}
      </label>
      {children}
      {hint && <p className="villa-form-field__hint">{hint}</p>}
    </div>
  );
}

type VillaFormGridProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3;
};

export function VillaFormGrid({ children, cols = 2 }: VillaFormGridProps) {
  const gridClass =
    cols === 3
      ? "villa-form-grid villa-form-grid--3"
      : cols === 1
        ? "villa-form-grid"
        : dash.formGrid2;
  return <div className={gridClass}>{children}</div>;
}

type VillaFormToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function VillaFormToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: VillaFormToggleProps) {
  return (
    <label
      className={`villa-form-toggle${disabled ? " villa-form-toggle--disabled" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="villa-form-toggle__input"
      />
      <span className="villa-form-toggle__copy">
        <span className="villa-form-toggle__label">{label}</span>
        {description && (
          <span className="villa-form-toggle__desc">{description}</span>
        )}
      </span>
    </label>
  );
}

type VillaFormSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; hint?: string }[];
  hint?: string;
};

export function VillaFormSelect({
  label,
  value,
  onChange,
  options,
  hint,
}: VillaFormSelectProps) {
  return (
    <VillaFormField label={label} hint={hint}>
      <select
        className={dash.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1C1E]">
            {opt.label}
          </option>
        ))}
      </select>
    </VillaFormField>
  );
}

type VillaFormNoticeProps = {
  tone?: "info" | "warning" | "success";
  children: ReactNode;
};

export function VillaFormNotice({
  tone = "info",
  children,
}: VillaFormNoticeProps) {
  return (
    <div className={`villa-form-notice villa-form-notice--${tone}`}>
      {children}
    </div>
  );
}

export const villaFormInputClass = dash.input;
export const villaFormTextareaClass = `${dash.input} min-h-[100px] resize-y`;
