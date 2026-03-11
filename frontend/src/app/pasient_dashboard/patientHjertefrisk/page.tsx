import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";

export default function Page() {
  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasient_dashboard/patientHjertefrisk" />

      <main>
        <h1>Hjertefrisk</h1>
      </main>
    </div>
  );
}
