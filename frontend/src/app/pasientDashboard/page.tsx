"use client";

import { PatientDashboardProfile } from "../../components/molecules/PatientDashboardProfile";
import { PatientSidebarNav } from "../../components/organisms/PatientSidebarNav";
import { CalendarCard } from "../../components/molecules/CalendarCard";
import { ActivityList } from "../../components/molecules/ActivityList";
import { QuestionnaireList } from "../../components/molecules/QuestionnaireList";
import { DashboardCard } from "@/components/molecules/DashboardCard";
import { PatientHeader } from "../../components/organisms/PatientHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { apiClient } from "@/lib/apiClient";
import type { LatestMeasurementResultDto } from "@/types";

export default function PatientDashboardPage() {
  const router = useRouter();
  const { user, isAuthReady } = useUser();

  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!user) return;
    if (user.role !== "pasient") return;

    const run = async () => {
      try {
        const isNumericId = /^\d+$/.test(user.id);
        const localPatientId = isNumericId
          ? Number(user.id)
          : (
              await apiClient.get<{
                id: number;
                supabaseUserId: string;
                name: string;
                email: string;
              }>(`/api/Patients/by-supabase/${user.id}`)
            ).id;

        const latest = await apiClient.get<LatestMeasurementResultDto[]>(
          `/api/patients/${encodeURIComponent(String(localPatientId))}/latest-measurements`,
        );

        const latestHeight = latest.find((m) => m.measurementId === 2)?.result;
        const latestWeight = latest.find((m) => m.measurementId === 1)?.result;

        setHeight(typeof latestHeight === "number" ? latestHeight : null);
        setWeight(typeof latestWeight === "number" ? latestWeight : null);
      } catch {
        setHeight(null);
        setWeight(null);
      }
    };

    void run();
  }, [isAuthReady, user]);

  const today = new Date();

  const activityDate = new Date();
  activityDate.setDate(today.getDate() + 3);

  const activityDateText = activityDate.toLocaleDateString("no-NO", {
    day: "numeric",
    month: "long",
  });

  const activities = [
    {
      id: 1,
      title: "Gå på kostholdskurs",
      date: `${activityDateText} 14:00`,
      location: "Haraldsgata 226",
      organizer: "Frisklivssentralen",
    },
  ];

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard" />

      <div className="flex flex-col flex-1">
        <PatientHeader />

        <main className="flex-1 bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <PatientDashboardProfile
              name={user?.name}
              height={height}
              weight={weight}
            />

            <div className="grid grid-cols-[320px_1fr] gap-6">
              <CalendarCard activityDate={activityDate} />
              <ActivityList activities={activities} />
            </div>

            <div className="grid grid-cols-3 gap-6 items-stretch">
              <QuestionnaireList />

              <div className="flex flex-col gap-6 h-full">
                <DashboardCard
                  className="flex-1"
                  text="Trykk her for å gå til din risikoside"
                  onClick={() =>
                    router.push("/pasientDashboard/pasientRisikoside")
                  }
                />

                <DashboardCard
                  className="flex-1"
                  text="Trykk her for å gå til tiltak"
                  onClick={() =>
                    router.push("/pasientDashboard/pasientTiltakside")
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
