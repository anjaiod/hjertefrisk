"use client";

import PatientRow from "../molecules/PatientRow";
import { TagVariant } from "../atoms/Tag";
import { useEffect, useState } from "react";
import { fetchNotifications } from "@/lib/notifications";

export interface Patient {
  id: string;
  name: string;
  lastVisited: string;
  lastVisitedRaw: string;
  riskLevel: TagVariant;
}

export type SortKey = "name" | "lastVisited";
export type SortDir = "asc" | "desc";

interface PatientTableProps {
  patients: Patient[];
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
}) {
  if (sortKey !== col) return <span className="ml-1 text-lg">⇅</span>;
  return <span className="ml-1 text-lg">{sortDir === "asc" ? "↑" : "↓"}</span>;
}

export default function PatientTable({
  patients,
  sortKey,
  sortDir,
  onSort,
}: PatientTableProps) {
  const [unreadPatientIds, setUnreadPatientIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await fetchNotifications();
        const unreadIds = new Set<number>();
        for (const n of all) {
          if (!n.read) unreadIds.add(n.patientId);
        }
        if (mounted) setUnreadPatientIds(unreadIds);
      } catch (e) {
        console.error("Failed to fetch notifications for patient table", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [patients]);

  const thClass = "px-6 py-4 text-left text-brand-navy font-semibold";
  const sortThClass = `${thClass} select-none`;

  return (
    <div className="rounded-xl overflow-hidden border border-brand-mist/50 shadow-sm">
      <table className="w-full">
        <thead className="bg-brand-sky/30">
          <tr>
            <th className={sortThClass}>
              <button
                className="flex items-center gap-1 cursor-pointer group"
                onClick={() => onSort("name")}
              >
                <span className="group-hover:underline">Navn</span>
                <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className={sortThClass}>
              <button
                className="flex items-center gap-1 cursor-pointer group"
                onClick={() => onSort("lastVisited")}
              >
                <span className="group-hover:underline">Sist besøkt</span>
                <SortIcon
                  col="lastVisited"
                  sortKey={sortKey}
                  sortDir={sortDir}
                />
              </button>
            </th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Handling</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <PatientRow
              key={patient.id}
              id={patient.id}
              name={patient.name}
              lastVisited={patient.lastVisited}
              riskLevel={patient.riskLevel}
              hasUnread={unreadPatientIds.has(Number(patient.id))}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
