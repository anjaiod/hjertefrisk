"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";
import FocusTrap from "focus-trap-react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ onClose, children, title }: ModalProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <FocusTrap
      focusTrapOptions={{ escapeDeactivates: false, allowOutsideClick: true }}
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-lg relative flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 px-6 pt-6 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition text-lg leading-none cursor-pointer"
            >
              ✕
            </button>
            {title && (
              <h2 className="text-2xl font-semibold text-brand-navy text-center mb-2">
                {title}
              </h2>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </div>
      </div>
    </FocusTrap>,
    document.body,
  );
}
