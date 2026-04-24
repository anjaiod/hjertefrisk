"use client";

import { Modal } from "@/components/atoms/Modal";

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Bekreft",
  cancelLabel = "Avbryt",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal onClose={onCancel} title={title}>
      <p className="text-sm text-gray-600 text-center mt-1 mb-6">{message}</p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
