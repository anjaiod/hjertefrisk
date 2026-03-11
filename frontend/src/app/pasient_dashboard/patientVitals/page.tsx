import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";

export default function Page() {
  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasient_dashboard/patientVitals" />

      <main>
        <h1>Vitalia</h1>
      </main>
    </div>
  );
}
