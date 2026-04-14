"use client";

import PatientRow from "../molecules/PatientRow";
import { TagVariant } from "../atoms/Tag";

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
  if (sortKey !== col)
    return <span className="ml-1 text-brand-navy/40">⇅</span>;
  return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
}

export default function PatientTable({
  patients,
  sortKey,
  sortDir,
  onSort,
}: PatientTableProps) {
  const thClass = "px-6 py-4 text-left text-brand-navy font-semibold";
  const sortThClass = `${thClass} cursor-pointer select-none hover:text-brand-sky transition-colors`;

  return (
    <div className="rounded-xl overflow-hidden border border-brand-mist/50 shadow-sm">
      <table className="w-full">
        <thead className="bg-brand-sky/30">
          <tr>
            <th className={sortThClass} onClick={() => onSort("name")}>
              Navn <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th className={sortThClass} onClick={() => onSort("lastVisited")}>
              Sist besøkt{" "}
              <SortIcon col="lastVisited" sortKey={sortKey} sortDir={sortDir} />
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
