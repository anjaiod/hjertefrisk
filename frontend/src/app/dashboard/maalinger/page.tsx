"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/UserContext";
import type { MeasurementDto, MeasurementResultDto } from "@/types";

export default function Page() {
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId");
  const { user } = useUser();

  const [measurements, setMeasurements] = useState<MeasurementDto[]>([]);
  const [results, setResults] = useState<Record<number, MeasurementResultDto>>({});
  const [editValues, setEditValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [measurementsData, resultsData] = await Promise.all([
          apiClient.get<MeasurementDto[]>("/api/Measurements"),
          apiClient.get<MeasurementResultDto[]>(
            `/api/patients/${encodeURIComponent(patientId)}/all-measurements`,
          ),
        ]);

        setMeasurements(measurementsData);

        const byId: Record<number, MeasurementResultDto> = {};
        for (const r of resultsData) {
          byId[r.measurementId] = r;
        }
        setResults(byId);
      } catch {
        setError("Kunne ikke laste målinger.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [patientId]);

  const handleEdit = (measurementId: number, current: string) => {
    setEditValues((prev) => ({ ...prev, [measurementId]: current }));
  };

  const handleCancelEdit = (measurementId: number) => {
    setEditValues((prev) => {
      const next = { ...prev };
      delete next[measurementId];
      return next;
    });
  };

  const handleSave = async () => {
    if (!patientId) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const personnelId = user ? parseInt(user.id, 10) : null;

    const payload = Object.entries(editValues)
      .map(([id, val]) => {
        const parsed = Number(val.replace(",", "."));
        if (!Number.isFinite(parsed)) return null;
        return {
          measurementId: parseInt(id, 10),
          patientId: parseInt(patientId, 10),
          result: parsed,
          registeredBy: personnelId ?? undefined,
        };
      })
      .filter(Boolean) as { measurementId: number; patientId: number; result: number; registeredBy?: number | null }[];

    // Recalculate BMI if height (1) or weight (2) was edited
    const weightVal = payload.find((p) => p.measurementId === 1)?.result
      ?? results[1]?.result;
    const heightVal = payload.find((p) => p.measurementId === 2)?.result
      ?? results[2]?.result;

    if (
      heightVal != null &&
      weightVal != null &&
      heightVal > 0 &&
      (1 in editValues || 2 in editValues)
    ) {
      const heightM = heightVal / 100;
      const bmi = Math.round((weightVal / (heightM * heightM)) * 10) / 10;
      payload.push({
        measurementId: 10,
        patientId: parseInt(patientId, 10),
        result: bmi,
        registeredBy: personnelId ?? undefined,
      });
    }

    if (payload.length === 0) {
      setSaving(false);
      return;
    }

    try {
      const saved = await apiClient.post<MeasurementResultDto[]>(
        "/api/MeasurementResults/bulk",
        payload,
      );

      const byId: Record<number, MeasurementResultDto> = { ...results };
      for (const r of saved) {
        byId[r.measurementId] = r;
      }
      setResults(byId);
      setEditValues({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Kunne ikke lagre målinger.");
    } finally {
      setSaving(false);
    }
  };

  const hasEdits = Object.keys(editValues).length > 0;

  if (!patientId) {
    return (
      <div className="p-8">
        <p className="text-amber-600">Ingen pasient valgt.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Målinger</h1>

      {loading && <p className="text-gray-500">Laster målinger...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {measurements.map((m) => {
              const result = results[m.measurementId];
              const isEditing = m.measurementId in editValues;
              const currentValue = isEditing
                ? editValues[m.measurementId]
                : result?.result?.toString() ?? "";

              const isBmi = m.measurementId === 10;

              return (
                <div
                  key={m.measurementId}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">{m.fallbackText}</p>
                    {isBmi && (
                      <p className="text-xs text-gray-400">Beregnes automatisk</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {!isBmi && isEditing ? (
                      <>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
                            value={currentValue}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [m.measurementId]: e.target.value,
                              }))
                            }
                            autoFocus
                          />
                          {m.unit && (
                            <span className="text-sm text-gray-500">{m.unit}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancelEdit(m.measurementId)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Avbryt
                        </button>
                      </>
                    ) : (
                      <>
                        {result ? (
                          <span className="text-gray-800 font-medium">
                            {result.result} {m.unit || ""}
                          </span>
                        ) : (
                          <span className="text-amber-500 text-sm italic">
                            Mangler
                          </span>
                        )}
                        {!isBmi && (
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                m.measurementId,
                                result?.result?.toString() ?? "",
                              )
                            }
                            className="text-sm text-brand-navy hover:underline"
                          >
                            Rediger
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {saveSuccess && (
            <p className="text-green-600 text-sm mt-4">Målinger lagret!</p>
          )}
          {saveError && (
            <p className="text-red-500 text-sm mt-4">{saveError}</p>
          )}

          {hasEdits && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-brand-navy text-white rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Lagrer..." : "Lagre endringer"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
