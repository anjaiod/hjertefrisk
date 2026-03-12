import PatientRow from "../molecules/PatientRow";
import { TagVariant } from "../atoms/Tag";

export interface Patient {
  id: string;
  name: string;
  lastVisited: string;
  riskLevel: TagVariant;
}

interface PatientTableProps {
  patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-brand-mist/50 shadow-sm">
      <table className="w-full">
        <thead className="bg-brand-sky/30">
          <tr>
            <th className="px-6 py-4 text-left text-brand-navy font-semibold">
              Navn
            </th>
            <th className="px-6 py-4 text-left text-brand-navy font-semibold">
              Sist besøkt
            </th>
            <th className="px-6 py-4 text-left text-brand-navy font-semibold">
              Status
            </th>
            <th className="px-6 py-4 text-left text-brand-navy font-semibold">
              Handling
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <PatientRow
              key={patient.id}
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
