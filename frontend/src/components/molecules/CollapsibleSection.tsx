"use client";

import { useState, ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  forceOpen,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [prevForceOpen, setPrevForceOpen] = useState(forceOpen);

  if (forceOpen !== prevForceOpen) {
    setPrevForceOpen(forceOpen);
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={forceOpen === true}
        className="w-full px-6 py-4 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer disabled:cursor-default"
      >
        <h2 className="text-xl font-bold text-brand-navy">{title}</h2>
        <svg
          className={`w-6 h-6 text-brand-navy transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-gray-200">{children}</div>
      )}
    </div>
  );
}
