"use client";

import { PatientProfile } from "../../components/molecules/PatientProfile";
import { TodoList } from "../../components/molecules/TodoList";
import { RiskList } from "../../components/molecules/RiskList";
import { FeatureCardGrid } from "../../components/molecules/FeatureCardGrid";

import type { LatestMeasurementResultDto, PatientDto, ToDoDto } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { getRisks, type CategoryRisk } from "@/components/molecules/RiskList";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
  const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean; public: boolean }[]>([]);
  const [latestMeasurements, setLatestMeasurements] = useState<LatestMeasurementResultDto[]>([]);
  const [risks, setRisks] = useState<CategoryRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId || patientId.trim() === "") {
      setSelectedPatient(null);
      setTodos([]);
      setLatestMeasurements([]);
      setRisks([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Record visit (fire and forget)
        apiClient
          .patch(`/api/patients/${encodeURIComponent(patientId)}/visit`)
          .catch(() => {});

        // Fetch patient data, todos, measurements, and risks in parallel
        const [patient, allTodos, measurements, categoryRisks] =
          await Promise.all([
            apiClient.get<PatientDto>(
              `/api/patients/${encodeURIComponent(patientId)}`,
            ),
            apiClient.get<ToDoDto[]>("/api/todos"),
            apiClient.get<LatestMeasurementResultDto[]>(
              `/api/patients/${encodeURIComponent(patientId)}/latest-measurements`,
            ),
            getRisks(patientId),
          ]);

        setSelectedPatient(patient);

        const filteredTodos = allTodos
          .filter((t) => String(t.patientId) === patientId)
          .map((t) => ({ id: t.toDoId, text: t.toDoText, completed: t.finished, public: t.public }));
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
            patientId={patientId ? Number(patientId) : undefined}
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
