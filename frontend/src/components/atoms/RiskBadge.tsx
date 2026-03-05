export function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 border border-red-300">
      {risk}
    </span>
  );
}