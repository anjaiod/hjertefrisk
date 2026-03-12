export function CalendarCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">April 2026</h3>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="p-2 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
