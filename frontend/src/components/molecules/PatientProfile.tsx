export function PatientProfile({
  name = "Ola Nordmann",
  age = 45,
  gender = "Mann",
}: {
  name?: string;
  age?: number;
  gender?: string;
}) {
  return (
    <div className="flex flex-col items-left justify-center">
      <h1 className="text-4xl font-bold text-brand-navy">{name}</h1>
      <div className="mt-2 text-lg text-slate-600">
        <p>{gender}, {age} år</p>
      </div>
    </div>
  );
}
