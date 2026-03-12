import { PatientProfile } from "../../components/molecules/PatientProfile";
import { PatientSidebarNav } from "../../components/organisms/PatientSidebarNav";
import { CalendarCard } from "../../components/molecules/CalendarCard";
import { ActivityList } from "../../components/molecules/ActivityList";
import { QuestionnaireList } from "../../components/molecules/QuestionnaireList";
import { FeatureCard } from "../../components/atoms/FeatureCard";
import { PatientHeader } from "../../components/organisms/PatientHeader";

export default function PatientDashboardPage() {
  // aktiviteter
  const activities = [
    {
      id: 1,
      title: "Gå på kostholdskurs",
      date: "I dag 14:00",
      location: "Haraldsgata 226",
      organizer: "Frisklivssentralen",
    },
  ];

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/patient_dashboard" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="flex-1 bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <PatientProfile />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <CalendarCard />
              <ActivityList activities={activities} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <QuestionnaireList />

              <div className="flex flex-col gap-6">
                <FeatureCard
                  icon="❗️"
                  title="Din risikoside"
                  description="Trykk her for å gå til din risikoside"
                  iconBgColor="bg-green-100"
                />

                <FeatureCard
                  icon="💪"
                  title="Tiltak"
                  description="Trykk her for å gå til tiltak"
                  iconBgColor="bg-teal-100"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
