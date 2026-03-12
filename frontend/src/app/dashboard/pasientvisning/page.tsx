import PatientTable, { Patient } from "@/components/organisms/PatientTable";
import { SidebarNav } from "@/components/organisms/SidebarNav";

const mockPatients: Patient[] = [
  { id: "1", name: "Pasient Pasientsen 1", lastVisited: "09.03.2026", score: 9.4 },
  { id: "2", name: "Pasient Pasientsen 2", lastVisited: "09.03.2026", score: 9.4 },
  { id: "3", name: "Pasient Pasientsen 3", lastVisited: "09.03.2026", score: 9.4 },
  { id: "4", name: "Pasient Pasientsen 4", lastVisited: "09.03.2026", score: 7.2 },
  { id: "5", name: "Pasient Pasientsen 5", lastVisited: "09.03.2026", score: 7.2 },
  { id: "6", name: "Pasient Pasientsen 6", lastVisited: "09.03.2026", score: 7.2 },
  { id: "7", name: "Pasient Pasientsen 7", lastVisited: "09.03.2026", score: 3.4 },
  { id: "8", name: "Pasient Pasientsen 8", lastVisited: "09.03.2026", score: 3.4 },
  { id: "9", name: "Pasient Pasientsen 9", lastVisited: "09.03.2026", score: 3.4 },
];

export default function Page() {
  return (
    <div className="flex">
      <SidebarNav activePath="/dashboard/pasientvisning" />
      <main className="flex-1 bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-brand-navy mb-6">Pasienter</h1>
          <PatientTable patients={mockPatients} />
        </div>
      </main>
    </div>
  );
}

