export default function Page() {
  return  (
    <div className="flex flex-col gap-3 mt-4">
      <h1>Landingpage</h1>
      <a href="/dashboard/" className="text-brand-navy underline">
          Gå til Dashboard
        </a>

        <a href="/pasientDashboard" className="text-brand-navy underline">
          Gå til Pasient Dashboard
        </a>
    </div>
  );
}
