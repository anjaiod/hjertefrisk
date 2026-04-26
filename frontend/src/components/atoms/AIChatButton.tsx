"use client";

import { useEffect, useRef, useState } from "react";

export function AIChatButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {open && (
        <div className="w-72 bg-brand-sun-background rounded-2xl shadow-xl border border-brand-sun-light p-4 flex flex-col gap-3">
          <div className="bg-brand-sun-lightest text-slate-900 rounded-xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
            Hei! Jeg er en AI-chatbot som kan hjelpe deg å finne det du trenger
            på siden.
            <br />
            <br />
            Jeg er ikke helt klar til å hjelpe deg enda, men jeg jobber med
            saken!
          </div>
        </div>
      )}

      <button
        aria-label="AI-assistent"
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-brand-sun shadow-lg flex items-center justify-center cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      </button>
    </div>
  );
}
