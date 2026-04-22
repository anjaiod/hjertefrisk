export function PatientDashboardProfile({
  name,
  height,
  weight,
}: {
  name?: string;
  height?: number | null;
  weight?: number | null;
}) {
  const hasHeight = typeof height === "number" && Number.isFinite(height);
  const hasWeight = typeof weight === "number" && Number.isFinite(weight);

  const bmi =
    hasHeight && hasWeight ? (weight / (height * height)) * 10000 : null;

  const info = [
    hasHeight ? `${height} cm` : null,
    hasWeight ? `${weight} kg` : null,
    typeof bmi === "number" ? `BMI: ${bmi.toFixed(1)}` : null,
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 rounded-full bg-brand-teal flex items-center justify-center">
        <span className="text-white text-2xl font-semibold">
          {name?.charAt(0).toUpperCase() ?? "P"}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">{name}</h1>

        {info.length > 0 && (
          <p className="text-sm text-brand-sage mt-1">{info.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
