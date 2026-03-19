export function PatientProfile({
  name = "Ola Nordmann",
  age,
  gender,
  height = null,
  weight = null,
}: {
  name?: string;
  age?: number;
  gender?: string;
  height?: number | null;
  weight?: number | null;
}) {
  const hasHeight = typeof height === "number" && Number.isFinite(height);
  const hasWeight = typeof weight === "number" && Number.isFinite(weight);
  const bmi =
    hasHeight && hasWeight ? (weight / (height * height)) * 10000 : null;

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-brand-navy">{name}</h1>
        {(() => {
          const parts: string[] = [];
          if (typeof gender === "string" && gender.trim() !== "") {
            parts.push(gender);
          }
          if (typeof age === "number" && Number.isFinite(age)) {
            parts.push(`${age} år`);
          }
          if (parts.length === 0) return null;
          return (
            <p className="text-base text-slate-600 mt-1">{parts.join(", ")}</p>
          );
        })()}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="border-l-4 border-brand-sky pl-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">
              Høyde
            </p>
            <p className="text-xl font-bold text-brand-navy">
              {hasHeight ? `${height} cm` : "-"}
            </p>
          </div>
          <div className="border-l-4 border-brand-sage pl-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">
              Vekt
            </p>
            <p className="text-xl font-bold text-brand-navy">
              {hasWeight ? `${weight} kg` : "-"}
            </p>
          </div>
          <div className="border-l-4 border-brand-teal pl-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">
              BMI
            </p>
            <p className="text-xl font-bold text-brand-navy">
              {typeof bmi === "number" ? bmi.toFixed(1) : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
