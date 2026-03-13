import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";

export default function Page() {
  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasient_dashboard/pasientTiltakside" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="p-8">
          <h1 className="text-2xl font-semibold">Dine tiltak</h1>
        </main>
      </div>
    </div>
  );
}
