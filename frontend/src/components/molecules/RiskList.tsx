import { Tag } from "../atoms/Tag";
import type { TagVariant } from "../atoms/Tag";

type RiskItem = { name: string; variant: "high" | "medium" };

function tagLabel(variant: TagVariant): string {
  if (variant === "high") return "Høy";
  if (variant === "medium") return "Middels";
  return "Lav";
}

export function RiskList({ risks = [] }: { risks?: RiskItem[] }) {
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
          key={risk.name}
          className="rounded-lg border border-brand-mist-lighter p-3 flex items-center justify-between"
        >
          <p className="text-slate-900">{risk.name}</p>
          <Tag variant={risk.variant} className="text-xs px-2 py-1">
            {tagLabel(risk.variant)}
          </Tag>
        </div>
      ))}
    </div>
  );
}
