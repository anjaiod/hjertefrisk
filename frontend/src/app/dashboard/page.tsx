import { PatientProfile } from "../../components/molecules/PatientProfile";
import { TodoList } from "../../components/molecules/TodoList";
import { RiskList } from "../../components/molecules/RiskList";
import { FeatureCardGrid } from "../../components/molecules/FeatureCardGrid";

import type { LatestMeasurementResultDto, PatientDto, ToDoDto } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import { getApiBaseUrl } from "@/lib/apiClient";

type RiskVariant = "high" | "medium" | "low";
type CategoryRisk = { name: string; variant: RiskVariant };

const CATEGORY_RISK_THRESHOLDS: Record<
  string,
  { high: number; medium: number | null }
> = {
  "fysisk aktivitet": { high: 9, medium: 5 },
  kosthold:           { high: 9, medium: 5 },
  rusmidler:          { high: 3, medium: 1 },
  alkohol:            { high: 15, medium: 8 },
  røyking:            { high: 2, medium: 1 },
  tannhelse:          { high: 1, medium: null },
  kroppsdata:         { high: 2, medium: 1 },
  blodtrykk:          { high: 2, medium: 1 },
  glukose:            { high: 2, medium: 1 },
};

async function getRiskCategoriesForPatient(
  patientId: string,
): Promise<CategoryRisk[]> {
  const apiBaseUrl = getApiBaseUrl();

  const [queryRes, catsRes] = await Promise.all([
    fetch(`${apiBaseUrl}/api/Query/by-name/Helseskjema`, {
      cache: "no-store",
    }),
    fetch(`${apiBaseUrl}/api/Categories`, { cache: "no-store" }),
  ]);
  if (!queryRes.ok || !catsRes.ok) return [];

  const query: { id: number } = await queryRes.json();
  const categories: { categoryId: number; name: string }[] =
    await catsRes.json();

  const evalRes = await fetch(`${apiBaseUrl}/api/measures/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patientId: Number(patientId),
      queryId: query.id,
      languageCode: "no",
    }),
    cache: "no-store",
  });
  if (!evalRes.ok) return [];

  const result: {
    patientMeasures: { categoryId: number | null; title: string | null }[];
    categoryScores: Record<number, number>;
  } = await evalRes.json();

  const categoryScores = result.categoryScores ?? {};

  return categories
    .map((cat): CategoryRisk | null => {
      const isSleep = cat.name.toLowerCase().trim() === "søvn";

      if (isSleep) {
        const titles = result.patientMeasures
          .filter((m) => m.categoryId === cat.categoryId)
          .map((m) => m.title ?? "");
        if (titles.some((t) => t === "Betydelige søvnvansker"))
          return { name: cat.name, variant: "high" };
        if (titles.some((t) => t === "Noen søvnproblemer"))
          return { name: cat.name, variant: "medium" };
        if (titles.some((t) => t === "God søvn"))
          return { name: cat.name, variant: "low" };
        return null;
      }

      const score = categoryScores[cat.categoryId];
      if (score === undefined) return null;

      const thresholds = CATEGORY_RISK_THRESHOLDS[cat.name.toLowerCase().trim()];
      if (!thresholds) return null;

      if (score >= thresholds.high) return { name: cat.name, variant: "high" };
      if (thresholds.medium !== null && score >= thresholds.medium)
        return { name: cat.name, variant: "medium" };
      return { name: cat.name, variant: "low" };
    })
    .filter((r): r is CategoryRisk => r !== null);
}

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

  const allRisks =
    typeof patientId === "string" && patientId.trim() !== ""
      ? await getRiskCategoriesForPatient(patientId)
      : [];

  const highRisks = allRisks.filter((r) => r.variant === "high") as {
    name: string;
    variant: "high" | "medium";
  }[];
  const mediumRisks = allRisks.filter((r) => r.variant === "medium") as {
    name: string;
    variant: "high" | "medium";
  }[];
  const remaining = Math.max(0, 3 - highRisks.length);
  const risksToShow = [...highRisks, ...mediumRisks.slice(0, remaining)].slice(0, 3);

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
              <RiskList risks={risksToShow} />
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
