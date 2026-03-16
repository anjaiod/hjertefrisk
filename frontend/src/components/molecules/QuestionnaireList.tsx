import { Button } from "../atoms/Button";

export function QuestionnaireList() {
  // placeholder names
  const forms = [
    "Besvart Januar 2026",
    "Besvart Februar 2026",
    "Besvart Mars 2026",
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-2">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Tidligere spørreskjema
      </h3>
      <div className="flex flex-col gap-3">
        {forms.map((form) => (
          <div
            key={form}
            className="flex justify-between items-center border rounded-lg p-3"
          >
            <span className="text-slate-700">{form}</span>

            <Button>Åpne</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
