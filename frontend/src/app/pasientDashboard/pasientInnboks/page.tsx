import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";

export default function Page() {
  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientInnboks" />
      <div className="flex flex-col flex-1">
        <PatientHeader />
        <main>
          <h1>Innboks</h1>
        </main>
      </div>
    </div>
  );
}