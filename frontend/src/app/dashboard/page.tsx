import { SidebarNav } from "../../components/organisms/SidebarNav";
import { PatientProfile } from "../../components/molecules/PatientProfile";
import { TodoList } from "../../components/molecules/TodoList";
import { RiskList } from "../../components/molecules/RiskList";
import { FeatureCardGrid } from "../../components/molecules/FeatureCardGrid";

export default function DashboardPage() {
  const todos = [
    { id: 1, text: "Måle blodtrykk", completed: false },
    { id: 2, text: "Ta blodprøve", completed: true },
    { id: 3, text: "Henvise til frisklivssentralen", completed: false },
    { id: 4, text: "Logge vekt", completed: false },
  ];

  return (
    <div className="flex">
      <SidebarNav activePath="/dashboard" />
      <main className="flex-1 bg-slate-50 p-8">
        <div className="flex flex-col gap-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex gap-8">
            {/* Patient Info Card */}
            <div className="flex-1 bg-white rounded-xl border border-brand-mist/30 shadow-sm p-8">
              <div className="flex gap-12">
                {/* Patient Profile */}
                <div className="flex-1">
                  <PatientProfile />
                </div>

                {/* Divider */}
                <div className="w-px bg-slate-200" />

                {/* Risk Factors */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4 mt-11">Risikofaktorer:</h3>
                  <RiskList risks={["Høyt blodtrykk", "Røyking", "Høyt kolesterol"]} />
                </div>
              </div>
            </div>

            {/* Todo List */}
            <div className="w-96">
              <TodoList title="Oppgaver for Ola:" todos={todos} />
            </div>
          </div>

          {/* Info Cards Grid */}
          <div>
            <FeatureCardGrid />
          </div>
        </div>
      </main>
    </div>
  );
}
