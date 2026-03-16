"use client";

import { Modal } from "../atoms/Modal";

interface VarslingModalProps {
  patientName: string;
  onClose: () => void;
}

export function VarslingModal({ patientName, onClose }: VarslingModalProps) {
  return (
    <Modal onClose={onClose} title={`Varslinger – ${patientName}`}>
      <p className="text-slate-500 text-sm">Ingen varslinger for denne pasienten.</p>
    </Modal>
  );
}
