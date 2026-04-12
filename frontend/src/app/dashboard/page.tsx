"use client";

import { PatientProfile } from "../../components/molecules/PatientProfile";
import { TodoList } from "../../components/molecules/TodoList";
import { RiskList } from "../../components/molecules/RiskList";
import { FeatureCardGrid } from "../../components/molecules/FeatureCardGrid";

import type { LatestMeasurementResultDto, PatientDto, ToDoDto } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

type RiskVariant = "high" | "medium" | "low";
type CategoryRisk = { name: string; variant: RiskVariant };

const CATEGORY_RISK_THRESHOLDS: Record<
  string,
  { high: number; medium: number | null }
> = {
  "fysisk aktivitet": { high: 9, medium: 5 },
  kosthold: { high: 9, medium: 5 },
  rusmidler: { high: 3, medium: 1 },
  alkohol: { high: 15, medium: 8 },
  røyking: { high: 2, medium: 1 },
  tannhelse: { high: 1, medium: null },
  kroppsdata: { high: 2, medium: 1 },
  blodtrykk: { high: 2, medium: 1 },
  glukose: { high: 2, medium: 1 },
};

async function getRiskCategoriesForPatient(
  patientId: string,
): Promise<CategoryRisk[]> {
  try {
    const [query, categories] = await Promise.all([
      apiClient.get<{ id: number }>("/api/Query/by-name/Helseskjema"),
      apiClient.get<{ categoryId: number; name: string }[]>("/api/Categories"),
    ]);

    const result = await apiClient.post<{
      patientMeasures: { categoryId: number | null; title: string | null }[];
      categoryScores: Record<number, number>;
    }>("/api/measures/evaluate", {
      patientId: Number(patientId),
      queryId: query.id,
      languageCode: "no",
    });

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

        const thresholds =
          CATEGORY_RISK_THRESHOLDS[cat.name.toLowerCase().trim()];
        if (!thresholds) return null;

        if (score >= thresholds.high)
          return { name: cat.name, variant: "high" };
        if (thresholds.medium !== null && score >= thresholds.medium)
          return { name: cat.name, variant: "medium" };
        return { name: cat.name, variant: "low" };
      })
      .filter((r): r is CategoryRisk => r !== null);
  } catch (error) {
    console.error("Error fetching risk categories:", error);
    return [];
  }
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(
    null,
  );
  const [todos, setTodos] = useState<
    { id: number; text: string; completed: boolean }[]
  >([]);
  const [latestMeasurements, setLatestMeasurements] = useState<
    LatestMeasurementResultDto[]
  >([]);
  const [risks, setRisks] = useState<CategoryRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId || patientId.trim() === "") {
      setSelectedPatient(null);
      setTodos([
        { id: 1, text: "Måle blodtrykk", completed: false },
        { id: 2, text: "Ta blodprøve", completed: true },
        { id: 3, text: "Henvise til frisklivssentralen", completed: false },
        { id: 4, text: "Logge vekt", completed: false },
      ]);
      setLatestMeasurements([]);
      setRisks([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Fetch patient data, todos, measurements, and risks in parallel
        const [patients, allTodos, measurements, categoryRisks] =
          await Promise.all([
            apiClient.get<PatientDto>(
              `/api/patients/${encodeURIComponent(patientId)}`,
            ),
            apiClient.get<ToDoDto[]>("/api/todos"),
            apiClient.get<LatestMeasurementResultDto[]>(
              `/api/patients/${encodeURIComponent(patientId)}/latest-measurements`,
            ),
            getRiskCategoriesForPatient(patientId),
          ]);

        setSelectedPatient(patient);

        const filteredTodos = allTodos
          .filter((t) => String(t.patientId) === patientId)
          .map((t) => ({
            id: t.toDoId,
            text: t.toDoText,
            completed: t.finished,
          }));
        setTodos(filteredTodos || []);

        setLatestMeasurements(measurements || []);
        setRisks(categoryRisks);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setSelectedPatient(null);
        setTodos([]);
        setLatestMeasurements([]);
        setRisks([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  const patientName = selectedPatient?.name;

  const highRisks = risks.filter((r) => r.variant === "high");
  const mediumRisks = risks.filter((r) => r.variant === "medium");
  const remaining = Math.max(0, 3 - highRisks.length);
  const risksToShow = [...highRisks, ...mediumRisks.slice(0, remaining)].slice(
    0,
    3,
  );

  const heightResult = latestMeasurements.find((m) => m.measurementId === 2);
  const weightResult = latestMeasurements.find((m) => m.measurementId === 1);
  const height = heightResult ? Number(heightResult.result) : null;
  const weight = weightResult ? Number(weightResult.result) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

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
