// import STATUS knapp from "../atoms/****";
// import RISIKO-knapp from "../atoms/****";

interface PatientRowProps {
  name: string;
  lastVisited: string;
  // ENDRE riskLevel: RiskLevel;
  score: number;
  actions?: React.ReactNode;
}

export default function PatientRow({
  name,
  lastVisited,
  // ENDRE riskLevel: RiskLevel;
  score,
  actions,
}: PatientRowProps) {
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <span className="text-brand-sky font-medium cursor-pointer hover:underline">
          {name}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600 text-sm">{lastVisited}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {/* ENDRE til riktig navn <StatusBadge level={riskLevel} />
           <RiskScore score={score} /> */}
        </div>
      </td>
      <td className="px-6 py-4">{actions}</td>
    </tr>
  );
}
