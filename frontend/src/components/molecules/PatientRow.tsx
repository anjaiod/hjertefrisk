import { Tag, TagVariant } from "../atoms/Tag";
import { Button } from "../atoms/Button";

interface PatientRowProps {
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

export default function PatientRow({
  name,
  lastVisited,
  riskLevel,
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
          <Tag variant={riskLevel}>{tagLabel[riskLevel]}</Tag>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button variant="primary" className={btnClass}>Varsling</Button>
          <Button variant="primary" className={btnClass}>Todo</Button>
          <Button variant="primary" className={btnClass}>Presentasjon</Button>
        </div>
      </td>
    </tr>
  );
}
