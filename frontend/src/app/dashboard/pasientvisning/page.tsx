import PatientTable, { Patient } from "@/components/organisms/PatientTable";
import { SidebarNav } from "@/components/organisms/SidebarNav";
import { Input } from "@/components/atoms/Input";
import { SearchBar } from "@/components/atoms/SearchBar";

const mockPatients: Patient[] = [
  { id: "1", name: "Pasient Pasientsen 1", lastVisited: "09.03.2026", riskLevel: "high" },
  { id: "2", name: "Pasient Pasientsen 2", lastVisited: "09.03.2026", riskLevel: "high" },
  { id: "3", name: "Pasient Pasientsen 3", lastVisited: "09.03.2026", riskLevel: "high" },
  { id: "4", name: "Pasient Pasientsen 4", lastVisited: "09.03.2026", riskLevel: "medium" },
  { id: "5", name: "Pasient Pasientsen 5", lastVisited: "09.03.2026", riskLevel: "medium" },
  { id: "6", name: "Pasient Pasientsen 6", lastVisited: "09.03.2026", riskLevel: "medium" },
  { id: "7", name: "Pasient Pasientsen 7", lastVisited: "09.03.2026", riskLevel: "low" },
  { id: "8", name: "Pasient Pasientsen 8", lastVisited: "09.03.2026", riskLevel: "low" },
  { id: "9", name: "Pasient Pasientsen 9", lastVisited: "09.03.2026", riskLevel: "low" },
];

export default function Page() {
  return (
    <div className="flex">
      <SidebarNav activePath="/dashboard/pasientvisning" />
      <main className="flex-1 bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-brand-navy">Pasienter</h1>
            <div className="flex items-center gap-3">
              <Input
                as="select"
                className="w-36"
                options={[
                  { value: "high", label: "Status: Høy" },
                  { value: "medium", label: "Status: Middels" },
                  { value: "low", label: "Status: Lav" },
                  { value: "lastVisited", label: "Sist besøkt" },
                ]}
                placeholder="Filtrer"
                defaultValue=""
              />
              <SearchBar placeholder="Søk..." />
            </div>
          </div>
          <PatientTable patients={mockPatients} />
        </div>
      </main>
    </div>
  );
}
