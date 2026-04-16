import React, { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Checkbox({
  label,
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
  ...props
}: CheckboxProps) {
  // Require an accessible name: either label text or aria-label
  if (!label && !ariaLabel) {
    console.warn(
      "Checkbox component: Either provide a 'label' prop or 'aria-label' for accessibility"
    );
  }

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        disabled={disabled}
        aria-label={ariaLabel}
        className={`h-5 w-5 accent-brand-navy ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
        {...props}
      />
      {label && (
        <span className="text-base text-slate-700">
          {label}
        </span>
      )}
    </label>
  );
}
