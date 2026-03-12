export function RiskList({ risks = [] }: { risks?: string[] }) {
  if (risks.length === 0) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4">
        <p className="text-green-700 font-semibold">Ingen kjente risikofaktorer</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {risks.map((risk) => (
        <div key={risk} className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-red-700 font-semibold">{risk}</p>
        </div>
      ))}
    </div>
  );
}
