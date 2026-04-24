"use client";

import { PatientDashboardProfile } from "../../components/molecules/PatientDashboardProfile";
import { PatientSidebarNav } from "../../components/organisms/PatientSidebarNav";
import { CalendarCard } from "../../components/molecules/CalendarCard";
import { ActivityList } from "../../components/molecules/ActivityList";
import { QuestionnaireList } from "../../components/molecules/QuestionnaireList";
import { FeatureCard } from "@/components/atoms/FeatureCard";
import { PatientHeader } from "../../components/organisms/PatientHeader";
import { AIChatButton } from "@/components/atoms/AIChatButton";
import { useRouter } from "next/navigation";
import { Activity, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { apiClient } from "@/lib/apiClient";
import type { LatestMeasurementResultDto } from "@/types";

export default function PatientDashboardPage() {
  const router = useRouter();
  const { user, isAuthReady } = useUser();

  const [patientId, setPatientId] = useState<number | null>(null);
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
        setPatientId(localPatientId);
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

        <main className="flex-1 bg-slate-50 p-5">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <PatientDashboardProfile
              name={user?.name}
              height={height}
              weight={weight}
            />

            <div className="grid grid-cols-[260px_1fr] gap-4">
              <div className="flex flex-col gap-4 h-full">
                <FeatureCard
                  icon={<Activity className="w-7 h-7 text-brand-teal-dark" />}
                  title="Din risikoside"
                  description="Se dine risikofaktorer"
                  iconBgColor="bg-brand-sage/20"
                  className="flex-1"
                  onClick={() =>
                    router.push("/pasientDashboard/pasientRisikoside")
                  }
                />

                <FeatureCard
                  icon={<ClipboardList className="w-7 h-7 text-brand-navy" />}
                  title="Tiltak"
                  description="Se anbefalte tiltak for deg"
                  iconBgColor="bg-brand-sky/35"
                  className="flex-1"
                  onClick={() =>
                    router.push("/pasientDashboard/pasientTiltakside")
                  }
                />
              </div>

              {patientId ? (
                <QuestionnaireList patientId={patientId} />
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-500">
                  Laster spørreskjema...
                </div>
              )}
            </div>

            <div className="grid grid-cols-[1fr_320px] gap-6">
              <ActivityList activities={activities} />
              <CalendarCard activityDate={activityDate} />
            </div>
          </div>
        </main>
      </div>

      <AIChatButton />
    </div>
  );
}
