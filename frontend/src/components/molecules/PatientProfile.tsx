export function PatientProfile({
  name = "Ola Nordmann",
  age = 45,
  gender = "Mann",
  height = 180,
  weight = 110,
}: {
  name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
}) {
  const bmi = (weight / (height * height)) * 10000;

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-brand-navy">{name}</h1>
        <p className="text-base text-slate-600 mt-1">{gender}, {age} år</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="border-l-4 border-brand-sky pl-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">Høyde</p>
            <p className="text-xl font-bold text-brand-navy">{height} cm</p>
          </div>
          <div className="border-l-4 border-brand-sage pl-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">Vekt</p>
            <p className="text-xl font-bold text-brand-navy">{weight} kg</p>
          </div>
          <div className="border-l-4 border-brand-teal pl-4">
            <p className="text-xs text-slate-500 font-semibold uppercase">BMI</p>
            <p className="text-xl font-bold text-brand-navy">{bmi.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
