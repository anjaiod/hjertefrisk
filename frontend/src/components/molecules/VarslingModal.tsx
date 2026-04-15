"use client";

import { Modal } from "../atoms/Modal";

interface VarslingModalProps {
  patientName?: string;
  onClose: () => void;
}

export function VarslingModal({ patientName, onClose }: VarslingModalProps) {
  const title = patientName ? `Varslinger – ${patientName}` : "Varslinger";

  return (
    <Modal onClose={onClose} title={title}>
      <p className="text-slate-500 text-sm">
        Ingen varslinger for denne pasienten.
      </p>
    </Modal>
  );
}
