"use client";

import { useState } from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Søk...",
  className = "",
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");

  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue.length > 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(e.target.value);
    } else {
      setInternalValue(e.target.value);
    }
  }

  function handleClear() {
    if (onChange) {
      onChange("");
    } else {
      setInternalValue("");
    }
  }

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-full border bg-white px-4 py-2 transition-colors",
        hasValue
          ? "border-brand-sky text-slate-700"
          : "border-brand-mist-light text-slate-400",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "h-3 w-3 shrink-0 rounded-full transition-colors",
          hasValue ? "bg-brand-sky" : "bg-brand-mist",
        ].join(" ")}
      />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-brand-mist"
      />
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Tøm søk"
          className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
