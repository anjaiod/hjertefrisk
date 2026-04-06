"use client";

import { PatientProfile } from "../../components/molecules/PatientProfile";
import { TodoList } from "../../components/molecules/TodoList";
import { RiskList } from "../../components/molecules/RiskList";
import { FeatureCardGrid } from "../../components/molecules/FeatureCardGrid";

import type { LatestMeasurementResultDto, PatientDto, ToDoDto } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
  const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [latestMeasurements, setLatestMeasurements] = useState<LatestMeasurementResultDto[]>([]);
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
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Get all patients
        const patients = await apiClient.get<PatientDto[]>("/api/patients");
        const patient = patients.find((p) => String(p.id) === patientId) ?? null;
        setSelectedPatient(patient);

        // Get todos
        const allTodos = await apiClient.get<ToDoDto[]>("/api/todos");
        const filteredTodos = allTodos
          .filter((t) => String(t.patientId) === patientId)
          .map((t) => ({ id: t.toDoId, text: t.toDoText, completed: t.finished }));
        setTodos(filteredTodos || []);

        // Get latest measurements
        const measurements = await apiClient.get<LatestMeasurementResultDto[]>(
          `/api/patients/${encodeURIComponent(patientId)}/latest-measurements`
        );
        setLatestMeasurements(measurements || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setSelectedPatient(null);
        setTodos([]);
        setLatestMeasurements([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  const patientName = selectedPatient?.name;
  const heightResult = latestMeasurements.find((m) => m.measurementId === 2);
  const weightResult = latestMeasurements.find((m) => m.measurementId === 1);
  const height = heightResult ? Number(heightResult.result) : null;
  const weight = weightResult ? Number(weightResult.result) : null;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
