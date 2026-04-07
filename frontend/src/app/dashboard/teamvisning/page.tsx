"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { LatestMeasurementResultDto, PatientDto } from "@/types";
import { RiskList } from "@/components/molecules/RiskList";
import { Button } from "@/components/atoms/Button";

type RiskVariant = "high" | "medium" | "low";
type CategoryRisk = { name: string; variant: RiskVariant };

const CATEGORY_RISK_THRESHOLDS: Record<string, { high: number; medium: number | null }> = {
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

async function getRisks(patientId: string): Promise<CategoryRisk[]> {
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
    const scores = result.categoryScores ?? {};
    return categories
      .map((cat): CategoryRisk | null => {
        if (cat.name.toLowerCase().trim() === "søvn") {
          const titles = result.patientMeasures
            .filter((m) => m.categoryId === cat.categoryId)
            .map((m) => m.title ?? "");
          if (titles.some((t) => t === "Betydelige søvnvansker")) return { name: cat.name, variant: "high" };
          if (titles.some((t) => t === "Noen søvnproblemer")) return { name: cat.name, variant: "medium" };
          if (titles.some((t) => t === "God søvn")) return { name: cat.name, variant: "low" };
          return null;
        }
        const score = scores[cat.categoryId];
        if (score === undefined) return null;
        const thresholds = CATEGORY_RISK_THRESHOLDS[cat.name.toLowerCase().trim()];
        if (!thresholds) return null;
        if (score >= thresholds.high) return { name: cat.name, variant: "high" };
        if (thresholds.medium !== null && score >= thresholds.medium) return { name: cat.name, variant: "medium" };
        return { name: cat.name, variant: "low" };
      })
      .filter((r): r is CategoryRisk => r !== null);
  } catch {
    return [];
  }
}

export default function TeamvisningPage() {
  const patientId = useSearchParams().get("patientId");

  const [patient, setPatient] = useState<PatientDto | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [risks, setRisks] = useState<CategoryRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) { setLoading(false); return; }
    const load = async () => {
      try {
        const [patients, measurements, categoryRisks] = await Promise.all([
          apiClient.get<PatientDto[]>("/api/patients"),
          apiClient.get<LatestMeasurementResultDto[]>(
            `/api/patients/${encodeURIComponent(patientId)}/latest-measurements`
          ),
          getRisks(patientId),
        ]);
        setPatient(patients.find((p) => String(p.id) === patientId) ?? null);
        const h = measurements.find((m) => m.measurementId === 2);
        setHeight(h ? Number(h.result) : null);
        setRisks(categoryRisks);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Patient header */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-teal">
          <svg className="h-14 w-14 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-navy">{patient?.name}</h1>
          {height && <p className="mt-1 text-slate-500">{height} cm</p>}
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-start gap-6">
        {/* White card: risk list + graph */}
        <div className="flex flex-1 gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Risk list — fra components */}
          <div className="w-64 shrink-0">
            <h2 className="mb-4 text-base font-semibold text-brand-navy">
              Pasientens risikoområder:
            </h2>
            <RiskList risks={risks} />
          </div>

          {/* Graph placeholder */}
          <div className="flex flex-1 flex-col rounded-xl bg-brand-navy p-6">
            <span className="text-sm font-semibold text-white">Graf</span>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-brand-mist">Grafisk fremstilling av risikoprofil</p>
            </div>
          </div>
        </div>

        {/* Download section */}
        <div className="w-52 shrink-0">
          <h2 className="mb-3 text-base font-semibold text-brand-navy">Last ned rapporter</h2>
          <div className="flex flex-col gap-3">
            {["Risiko røyk", "Risiko kosthold", "Risiko fysisk aktivitet"].map((label) => (
              <Button key={label} variant="risk" fullWidth onClick={() => {}}>
                <span className="flex-1 text-left">{label}</span>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
