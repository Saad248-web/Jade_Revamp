"use client";

import type { InputHTMLAttributes } from "react";
import {
  getFieldShellClass,
  getFloatingLabelClass,
  JADE_FORM_INPUT_CLASS,
  JADE_FORM_INPUT_FOOTER_CLASS,
  JADE_FORM_WARN,
  themeToVariant,
  type JadeFormTheme,
} from "@/lib/jadeFormTokens";
import JadeFormFieldError from "./JadeFormFieldError";

export type JadeFloatingFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "tel" | "email";
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  name?: string;
  required?: boolean;
  invalid?: boolean;
  showError?: boolean;
  errorMessage?: string;
  theme: JadeFormTheme;
  className?: string;
};

export default function JadeFloatingField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  inputMode,
  autoComplete,
  name,
  required,
  invalid = false,
  showError = false,
  errorMessage,
  theme,
  className,
}: JadeFloatingFieldProps) {
  const variant = themeToVariant(theme);
  const indicating = invalid && showError;
  const errId = `${id}-err`;
  const inputClass =
    variant === "footer" ? JADE_FORM_INPUT_FOOTER_CLASS : JADE_FORM_INPUT_CLASS;

  return (
    <div className={className}>
      <div
        className={getFieldShellClass({
          invalid,
          showError,
          variant,
        })}
      >
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          aria-invalid={indicating}
          aria-describedby={indicating && errorMessage ? errId : undefined}
          className={inputClass}
        />
        <label htmlFor={id} className={getFloatingLabelClass(theme)}>
          {label}
          {indicating && required !== false ? (
            <span className="ml-1" style={{ color: JADE_FORM_WARN }}>
              *
            </span>
          ) : null}
        </label>
      </div>
      {showError && errorMessage ? (
        <JadeFormFieldError id={errId} message={errorMessage} />
      ) : null}
    </div>
  );
}
