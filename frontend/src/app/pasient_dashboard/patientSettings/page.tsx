import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";

export default function Page() {
  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasient_dashboard/patientSettings" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main>
          <h1>Innstillinger</h1>
        </main>
      </div>
    </div>
  );
}
