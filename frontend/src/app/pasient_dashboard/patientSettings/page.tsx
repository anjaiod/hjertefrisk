import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";

export default function Page() {
  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasient_dashboard/patientSettings" />

      <main>
        <h1>Innstillinger</h1>
      </main>
    </div>
  );
}
