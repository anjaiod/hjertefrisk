import { SidebarNav } from "../../components/organisms/SidebarNav";
import { PatientProfile } from "../../components/molecules/PatientProfile";
import { TodoList } from "../../components/molecules/TodoList";
import { RiskList } from "../../components/molecules/RiskList";

export default function DashboardPage() {
  const todos = [
    { id: 1, text: "Måle blodtrykk", completed: false },
    { id: 2, text: "Ta blodprøve", completed: true },
    { id: 3, text: "Henvise til frisklivssentralen", completed: false },
  ];

  const risks = ["Røyking", "Høyt blodtrykk", "Høyt kolesterol"];

  return (
    <div className="flex">
      <SidebarNav activePath="/dashboard" />
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-start gap-8">
            <div className="flex-1">
              <PatientProfile name="Ola Nordmann" age={45} gender="Mann" />
              <div className="mt-6">
                <RiskList risks={risks} />
              </div>
            </div>
            <div className="w-80">
              <TodoList title="Oppgaver for Ola:" todos={todos} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
