import { RiskBadge } from "../atoms/RiskBadge";

export function RiskList({ risks = [] }: { risks?: string[] }) {
  if (risks.length === 0) {
    return (
      <div className="">
        <p className="text-green-700 font-semibold">
          Ingen kjente risikofaktorer
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-wrap gap-2">
        {risks.map((risk) => (
          <RiskBadge key={risk} risk={risk} />
        ))}
      </div>
    </div>
  );
}
