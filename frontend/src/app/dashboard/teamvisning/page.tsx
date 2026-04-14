"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import type { LatestMeasurementResultDto, PatientDto } from "@/types";
import { RiskList, getRisks, type CategoryRisk } from "@/components/molecules/RiskList";

const CATEGORY_PDF: Record<string, string> = {
  "fysisk aktivitet": "Fysisk aktivitet og kosthold.pdf",
  kosthold: "Fysisk aktivitet og kosthold.pdf",
  rusmidler: "Injisering av rusmidler.pdf",
  alkohol: "Problematisk alkoholbruk.pdf",
  røyking: "Røyking.pdf",
  tannhelse: "Dårlig tannhelse.pdf",
  kroppsdata: "Overvekt.pdf",
  blodtrykk: "Blodtrykk.pdf",
  glukose: "Glukoseregulering.pdf",
  søvn: "Søvn.pdf",
};

export default function TeamvisningPage() {
  const patientId = useSearchParams().get("patientId");

  const [patient, setPatient] = useState<PatientDto | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
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
        const w = measurements.find((m) => m.measurementId === 1);
        setHeight(h ? Number(h.result) : null);
        setWeight(w ? Number(w.result) : null);
        setRisks(categoryRisks);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const bmi =
    height && weight ? Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10 : null;

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
          {(height || weight || bmi) && (
            <p className="mt-1 text-slate-500">
              {[
                height && `${height} cm`,
                weight && `${weight} kg`,
                bmi && `BMI ${bmi}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
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
            {risks
              .filter((r) => r.variant !== "low" && CATEGORY_PDF[r.name.toLowerCase().trim()])
              .map((r) => {
                const filename = CATEGORY_PDF[r.name.toLowerCase().trim()];
                return (
                  <a
                    key={r.name}
                    href={`/pdfs/${encodeURIComponent(filename)}`}
                    download={filename}
                    className="inline-flex w-full items-center justify-center rounded-lg border border-brand-orange bg-brand-orange px-5 py-2 text-base font-semibold text-white transition-colors hover:bg-brand-orange-light"
                  >
                    <span className="flex-1 text-left capitalize">{r.name}</span>
                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
