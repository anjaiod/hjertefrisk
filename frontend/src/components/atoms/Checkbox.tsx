import React, { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export function Checkbox({
  label,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        className={`h-5 w-5 accent-brand-navy ${className}`}
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
