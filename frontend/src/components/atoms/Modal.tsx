"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ onClose, children, title }: ModalProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg leading-none"
        >
          ✕
        </button>
        {title && (
          <h2 className="text-2xl font-semibold text-brand-navy text-center mb-2">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
