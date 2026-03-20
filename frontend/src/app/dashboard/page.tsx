import { PatientProfile } from "../../components/molecules/PatientProfile";
import { TodoList } from "../../components/molecules/TodoList";
import { RiskList } from "../../components/molecules/RiskList";
import { FeatureCardGrid } from "../../components/molecules/FeatureCardGrid";

import type { LatestMeasurementResultDto, PatientDto, ToDoDto } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import { getApiBaseUrl } from "@/lib/apiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DashboardPageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

function getSingleSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

async function getSelectedPatient(
  patientId: string,
): Promise<PatientDto | null> {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/patients`, { cache: "no-store" });
  if (!res.ok) return null;

  const patients: PatientDto[] = await res.json();
  return patients.find((p) => String(p.id) === patientId) ?? null;
}

async function getTodosForPatient(patientId: string) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/todos`, { cache: "no-store" });
  if (!res.ok) return [] as { id: number; text: string; completed: boolean }[];

  const todos: ToDoDto[] = await res.json();
  return todos
    .filter((t) => String(t.patientId) === patientId)
    .map((t) => ({ id: t.toDoId, text: t.toDoText, completed: t.finished }));
}

async function getLatestMeasurementsForPatient(patientId: string) {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(
    `${apiBaseUrl}/api/patients/${encodeURIComponent(patientId)}/latest-measurements`,
    { cache: "no-store" },
  );

  if (!res.ok) return [] as LatestMeasurementResultDto[];
  return (await res.json()) as LatestMeasurementResultDto[];
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  noStore();
  const sp = await Promise.resolve(searchParams ?? {});
  const patientId = getSingleSearchParam(sp.patientId);

  const selectedPatient =
    typeof patientId === "string" && patientId.trim() !== ""
      ? await getSelectedPatient(patientId)
      : null;

  const todos =
    typeof patientId === "string" && patientId.trim() !== ""
      ? await getTodosForPatient(patientId)
      : [
          { id: 1, text: "Måle blodtrykk", completed: false },
          { id: 2, text: "Ta blodprøve", completed: true },
          { id: 3, text: "Henvise til frisklivssentralen", completed: false },
          { id: 4, text: "Logge vekt", completed: false },
        ];

  const patientName = selectedPatient?.name;

  const latestMeasurements =
    typeof patientId === "string" && patientId.trim() !== ""
      ? await getLatestMeasurementsForPatient(patientId)
      : [];

  const heightResult = latestMeasurements.find((m) => m.measurementId === 2);
  const weightResult = latestMeasurements.find((m) => m.measurementId === 1);

  const height = heightResult ? Number(heightResult.result) : null;
  const weight = weightResult ? Number(weightResult.result) : null;

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      <div className="flex gap-8">
        {/* Patient Info Card */}
        <div className="flex-1 bg-white rounded-xl border border-brand-mist/30 shadow-sm p-8">
          <div className="flex gap-12">
            {/* Patient Profile */}
            <div className="flex-1">
              <PatientProfile
                name={patientName}
                height={height}
                weight={weight}
              />
            </div>

            {/* Divider */}
            <div className="w-px bg-slate-200" />

            {/* Risk Factors */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-brand-navy mb-4 mt-11">
                Risikofaktorer:
              </h3>
              <RiskList
                risks={["Høyt blodtrykk", "Røyking", "Høyt kolesterol"]}
              />
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="w-96">
          <TodoList
            key={patientId ?? "no-patient"}
            title={`Oppgaver for ${patientName}:`}
            todos={todos}
          />
        </div>
      </div>

      {/* Info Cards Grid */}
      <div>
        <FeatureCardGrid />
      </div>
    </div>
  );
}
