"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, TagVariant } from "../atoms/Tag";
import { Button } from "../atoms/Button";
import { TodoModal } from "./TodoModal";
import { VarslingModal } from "./VarslingModal";

interface PatientRowProps {
  id: string;
  name: string;
  lastVisited: string;
  riskLevel: TagVariant;
}

const tagLabel: Record<TagVariant, string> = {
  high: "Høy",
  medium: "Middels",
  low: "Lav",
};

const btnClass =
  "bg-brand-sky-lightest !text-brand-navy border-brand-sky-lightest hover:bg-brand-sky-lighter";

type ModalType = "todo" | "varsling" | null;

export default function PatientRow({
  id,
  name,
  lastVisited,
  riskLevel,
}: PatientRowProps) {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const router = useRouter();

  const dashboardHref = `/dashboard?patientId=${encodeURIComponent(id)}`;

  return (
    <>
      <tr
        className="border-t border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => router.push(dashboardHref)}
      >
        <td className="px-6 py-4">
          <span className="text-brand-sky font-medium hover:underline">
            {name}
          </span>
        </td>
        <td className="px-6 py-4 text-gray-600 text-sm">{lastVisited}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Tag variant={riskLevel}>{tagLabel[riskLevel]}</Tag>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="primary"
              className={btnClass}
              onClick={() => setOpenModal("varsling")}
            >
              Varsling
            </Button>
            <Button
              variant="primary"
              className={btnClass}
              onClick={() => setOpenModal("todo")}
            >
              Todo
            </Button>
            <Button
              variant="primary"
              className={btnClass}
              onClick={() => router.push(dashboardHref)}
            >
              Presentasjon
            </Button>
          </div>
        </td>
      </tr>
      {openModal === "todo" && (
        <TodoModal
          patientId={id}
          patientName={name}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "varsling" && (
        <VarslingModal patientName={name} onClose={() => setOpenModal(null)} />
      )}
    </>
  );
}
