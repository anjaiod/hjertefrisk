"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function BackButton({
  className = "",
  onClick,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={onClick ?? (() => router.back())}
      className={`flex items-center gap-2 text-base font-medium text-slate-700 hover:text-brand-navy bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer ${className}`}
      aria-label="Tilbake"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Tilbake
    </button>
  );
}
