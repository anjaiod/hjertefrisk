import { Tag } from "../atoms/Tag";

export function RiskList({ risks = [] }: { risks?: string[] }) {
  if (risks.length === 0) {
    return (
      <div className="rounded-lg bg-brand-mist-lightest border border-brand-mist-lighter p-4">
        <p className="text-slate-900 font-semibold">
          Ingen kjente risikofaktorer
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {risks.map((risk) => (
        <div
          key={risk}
          className="rounded-lg border border-brand-mist-lighter p-3 flex items-center justify-between"
        >
          <p className="text-slate-900 ">{risk}</p>
          <Tag variant="high" className="text-xs px-2 py-1">Høy risiko</Tag>
        </div>
      ))}
    </div>
  );
}
