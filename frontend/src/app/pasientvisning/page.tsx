"use client";

import { useEffect, useState } from "react";
import PatientTable, { Patient } from "@/components/organisms/PatientTable";
import { Input } from "@/components/atoms/Input";
import { SearchBar } from "@/components/atoms/SearchBar";
import { TagVariant } from "@/components/atoms/Tag";
import { PatientDto } from "@/types";
import { apiClient } from "@/lib/apiClient";

function scoreToRiskLevel(score: number): TagVariant {
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function fetchPatients(): Promise<Patient[]> {
  const patients = await apiClient.get<PatientDto[]>("/api/patients");

  return Promise.all(
    patients.map(async (p) => {
      let riskLevel: TagVariant = "low";
      try {
        const scoreData = await apiClient.get<{
          patientId: number;
          totalScore: number;
        }>(`/api/patients/${p.id}/score`);
        riskLevel = scoreToRiskLevel(scoreData.totalScore);
      } catch {
        // fallback to "low" if score fetch fails
      }
      return {
        id: String(p.id),
        name: p.name,
        lastVisited: formatDate(p.createdAt),
        riskLevel,
      };
    }),
  );
}

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .catch((error) => {
        console.error("Failed to fetch patients:", error);
        setPatients([]);
      });
  }, []);

  const filteredPatients = patients.filter((p) => {
    if (!search) return true;
    const query = search.toLowerCase();
    const lower = p.name.toLowerCase();
    return (
      lower.startsWith(query) ||
      lower.split(" ").some((part) => part.startsWith(query))
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Pasienter</h1>
        <div className="flex items-center gap-3">
          <div className="w-36">
            <Input
              as="select"
              options={[
                { value: "high", label: "Status: Høy" },
                { value: "medium", label: "Status: Middels" },
                { value: "low", label: "Status: Lav" },
                { value: "lastVisited", label: "Sist besøkt" },
              ]}
              placeholder="Filtrer"
              defaultValue=""
            />
          </div>
          <SearchBar
            placeholder="Søk..."
            value={search}
            onChange={setSearch}
            className="w-72"
          />
        </div>
      </div>
      <PatientTable patients={filteredPatients} />
    </div>
  );
}
